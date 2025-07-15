from datetime import datetime
import re
import time
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import json

MODEL_NAME = "teknium/OpenHermes-2.5-Mistral-7B"  # быстрее "TheBloke/OpenHermes-2.5-Mistral-7B-GPTQ"

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
TORCH_DTYPE = torch.float16 if DEVICE == "cuda" else torch.float32

tokenizer = AutoTokenizer.from_pretrained(
    MODEL_NAME,
    use_fast=False,  # avoid tiktoken issues - we use it for whisper
    trust_remote_code=True
)

model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    torch_dtype=TORCH_DTYPE,
    device_map="auto",
    trust_remote_code=True
)


def create_prompt(text):
    return f"""<<SYS>>You are a psychological analysis assistant. Extract insights from text into this exact JSON format. Be specific and concrete.<</SYS>>

[INST]
Analyze the text and output ONLY pure JSON with:
- Empty strings for missing data
- Arrays when multiple items possible
- NO additional text/comments

Structure EXACTLY:
```json
{
  "insights": {
    "emotional_dynamics": "",
    "key_triggers": [],
    "physical_reaction": "",
    "coping_strategies": {
      "effective": "",
      "ineffective": ""
    },
    "recommendations": []
  }
}
```

Text: '''{text}'''
[/INST] """

def clean_output(output):
    cleaned_output = output.replace('\\n', '')
    all_jsons = re.findall(r'```json\s*({.*?})\s*```', cleaned_output, re.DOTALL)

    if len(all_jsons) >= 2:
        second_json = all_jsons[1]  # вытаскиваем второй джсон - ответ
        return second_json
    else:
        return cleaned_output
    
def analyze_text(input_text, max_new_tokens=500): #500, чтобы сильно болтать не начал
    prompt = create_prompt(input_text)
    
    inputs = tokenizer(prompt, return_tensors="pt").to(DEVICE) # инпут в токены 
    
    # Generate attention mask to fix the warning
    attention_mask = inputs.attention_mask if 'attention_mask' in inputs else None
    
    output = model.generate(
        inputs.input_ids,
        attention_mask=attention_mask,  # Added attention mask
        max_new_tokens=max_new_tokens,
        temperature=0.2,  # Lower for more deterministic output
        do_sample=True, # чтобы температура работала
        pad_token_id=tokenizer.eos_token_id, # заполнять еос токенами пустые места, чтобы модель не запуталась
        repetition_penalty=1.1 # избегать повторяющихся фраз
    )
    
    full_output = tokenizer.decode(output[0], skip_special_tokens=True) # токены в аутпут
    
    full_output = clean_output(full_output)

    return json.dumps(full_output, indent=2)

if __name__ == "__main__":
    sample_texts = [
    "Today started well: I got a promotion email at 9 AM and felt excited. But by 4 PM, I saw my credit bill and anxiety spiked. My heart raced for 20 minutes. Later, chatting with my wife calmed me down, while scrolling Instagram made things worse.",
    "Ugh today was... I don't even know. Woke up at 11 because why not, skipped breakfast again. The meeting with Sarah was fine I guess but then Mark said that thing about my presentation and I just - you know? Walked out to get coffee, tripped on the stairs (classic), spilled it everywhere. Called mom but she was busy with her book club. Later at the gym, some guy kept staring at me while I was on the treadmill which was weird but also kinda flattering? Ate a whole pizza watching Netflix. Now it's 3am and I'm wondering why I can't sleep even though I'm exhausted. Tomorrow's another day I suppose. PS: My knee hurts from the fall but whatever.",
    "Monday standup: TeamLead: 'Status?' Alex: 'Debugging payment gateway API, 3/5 tasks complete.' Sam: 'Optimizing database queries, found 2 slow joins.' Jamie: 'Writing tests for auth service, 80% coverage.' TeamLead: 'Blockers?' Alex: 'Waiting on Stripe docs.' Sam: 'None.' Jamie: 'Need QA env access.' Wednesday check-in: TeamLead: 'Midweek update?' Alex: 'Finished gateway fixes, now load testing.' Sam: 'Query optimization complete.' Jamie: 'PR review pending.' Friday standup: TeamLead: 'Status?' Alex: 'Debugging payment gateway API, 3/5 tasks complete.' Sam: 'Query optimization done, moved to index tuning.' Jamie: 'Completed auth tests, reviewing PR 142.' TeamLead: 'Bottlenecks?' Alex: 'Load test dependencies.' Sam: 'None.' Jamie: 'PR feedback delays.' Friday retro: TeamLead: 'Weekly summary?' Alex: 'Shipped payment updates, 10% perf gain.' Sam: 'Reduced query times by 300ms avg.' Jamie: 'Merged auth tests, fixed 3 security gaps.' TeamLead: 'Next week?' Alex: 'Start fraud detection PoC.' Sam: 'Schema versioning research.' Jamie: 'OAuth implementation.'",
    "Felt tired. Went to bed early.",
    "hi i love my cat Misha it is grey and british and very very fat cute boy he love fish and seafood and love grass but don't like going outside and love watching birds",
    "Woke up at 11. Ate cereal. Watched YouTube. Played some phone games. Don't want tomorrow to come",
    "",
    "Felt тревожно in morning. Worse after кофе",
    "- Milk\n- Bread\n- Existential dread\n- Eggs",
    '{"mood":"happy","trigger":"none"} but actually text',
    "So like... I was uh... you know... feeling kinda sorta anxious? Or whatever. It was like... um... around 3pm maybe? I guess...",
    "I felt - no wait - first I was - actually let me start over - okay so - the thing is - well basically I felt tired but not sleepy tired just - you know - body tired but mind racing",
    "Maybe I felt somewhat slightly irritated or possibly annoyed, I'm not entirely sure, it could have just been tiredness perhaps, potentially from lack of sleep the previous night",
    "Okay so today was whatever coffee spilled meeting sucked boss said thing then I was like what the hell but anyway lunch was okay I guess sandwich was decent but then headache started and ugh you know how it is just one of those days",
    "Why am I so tired? Is this normal? Should I be worried? What if it doesn't get better? Maybe I should call someone? But who? What would I even say?",
    "Felt depresso all day. Had anxiety attac. My Brian won't stop. Need to sea doctor maybe.",
    "Felt like sh*t tbh. So tired rn. Slept like 3h. Probs should see doc but meh. Idk maybe tmrw.",
    "Eye fill so tired. Know thing helps. Might of caught some flue. Theirs know energy",
    "C-c-couldn't s-sleep l-last night. T-t-today ffffeel terrible. H-h-head [cut off]"
]
    with open("ml/outputs/benchmark_results.txt", "a", encoding="utf-8") as f:
        f.write(f"\n\n=== OpenHermes Mistral Benchmark | {datetime.now()} ===\n")

        for i, text in enumerate(sample_texts, 1):
            print(f"\nAnalyzing Sample Text {i}...")
            start_time = time.time()
            result = analyze_text(text)
            elapsed = time.time() - start_time

            print(f"Time: {elapsed:.2f}s")
            print(json.dumps(result, indent=2, ensure_ascii=False))