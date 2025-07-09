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
    return f"""<<SYS>>You are a psychological analysis assistant. 
    Extract insights from text into this exact JSON format, for missing information use empty strings:<</SYS>>

[INST]
Analyze this text and output ONLY valid JSON:

{{
    "insights": {{
        "emotional_dynamics": "Describe emotional shifts concisely",
        "key_triggers": [
            "Positive: [specific trigger]",
            "Negative: [specific trigger]"
        ],
        "physical_reaction": "Notable physical response with timing if available",
        "coping_strategies": {{
            "effective": "[specific action]",
            "ineffective": "[specific action]"
        }},
        "recommendations": [
            "Concrete suggestion 1",
            "Concrete suggestion 2"
        ]
    }}
}}

Text: '''{text}'''
[/INST]

Important:
- Use only the provided fields
- Be specific and concrete
- Output must be valid JSON"""

def analyze_text(input_text, max_new_tokens=500): #500, чтобы сильно болтать не начал
    prompt = create_prompt(input_text)
    
    inputs = tokenizer(prompt, return_tensors="pt").to(DEVICE) # инпут в токены 
    
    output = model.generate(
        inputs.input_ids,
        max_new_tokens=max_new_tokens,
        temperature=0.2,  # Lower for more deterministic output
        do_sample=True, # чтобы температура работала
        pad_token_id=tokenizer.eos_token_id, # заполнять еос токенами пустые места, чтобы модель не запуталась
        repetition_penalty=1.1 # избегать повторяющихся фраз
    )
    
    full_output = tokenizer.decode(output[0], skip_special_tokens=True) # токены в аутпут
    
    json_str = full_output.split('{', 1)[1].rsplit('}', 1)[0]
    json_str = '{' + json_str + '}'
    json_data = json.loads(json_str)
    return json.dumps(json_data, indent=2)

if __name__ == "__main__":
    sample_text_1 = """Today started well: I got a promotion email at 9 AM and felt excited. 
    But by 4 PM, I saw my credit bill and anxiety spiked. My heart raced for 20 minutes. 
    Later, chatting with my wife calmed me down, while scrolling Instagram made things worse."""

    sample_text_2 = """Ugh today was... I don't even know. Woke up at 11 because why not, skipped breakfast again. 
The meeting with Sarah was fine I guess but then Mark said that thing about my presentation 
and I just - you know? Walked out to get coffee, tripped on the stairs (classic), spilled 
it everywhere. Called mom but she was busy with her book club. 

Later at the gym, some guy kept staring at me while I was on the treadmill which was weird 
but also kinda flattering? Ate a whole pizza watching Netflix. Now it's 3am and I'm wondering 
why I can't sleep even though I'm exhausted. Tomorrow's another day I suppose. PS: My knee hurts 
from the fall but whatever."""

    sample_text_3 = """Monday standup: TeamLead: 'Status?' Alex: 'Debugging payment gateway API, 3/5 tasks complete.'
      Sam: 'Optimizing database queries, found 2 slow joins.' Jamie: 'Writing tests for auth service, 80% coverage.'
        TeamLead: 'Blockers?' Alex: 'Waiting on Stripe docs.' Sam: 'None.' Jamie: 'Need QA env access.' Wednesday
        check-in: TeamLead: 'Midweek update?' Alex: 'Finished gateway fixes, now load testing.' Sam: 'Query optimization
        complete.' Jamie: 'PR review pending.' Friday standup: TeamLead: 'Status?' Alex: 'Debugging payment gateway API,
        3/5 tasks complete.' Sam: 'Query optimization done, moved to index tuning.' Jamie: 'Completed auth tests,
        reviewing PR 142.' TeamLead: 'Bottlenecks?' Alex: 'Load test dependencies.' Sam: 'None.'
         Jamie: 'PR feedback delays.' Friday retro: TeamLead: 'Weekly summary?' Alex: 'Shipped payment updates, 10% perf gain.'
           Sam: 'Reduced query times by 300ms avg.' Jamie: 'Merged auth tests, fixed 3 security gaps.' TeamLead: 'Next week?'
             Alex: 'Start fraud detection PoC.' Sam: 'Schema versioning research.' Jamie: 'OAuth implementation.'"""
    
    result = analyze_text(sample_text_1)
    print("\nAnalysis Result:")
    print(result)

    result = analyze_text(sample_text_2)
    print("\nAnalysis Result:")
    print(result)
    
    result = analyze_text(sample_text_3)
    print("\nAnalysis Result:")
    print(result)