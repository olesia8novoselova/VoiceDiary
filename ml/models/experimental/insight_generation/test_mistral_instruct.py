from datetime import datetime
import time
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
import torch
from huggingface_hub import login

login(token="")

# Configuration for efficient CPU/GPU usage
quant_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.float16
)

# Initialize model and tokenizer
model_name = "mistralai/Mistral-7B-Instruct-v0.2"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    # quantization_config=quant_config,
    device_map="auto"
)

def generate_insights(text):
    # Define structured prompt with output example
    prompt = f"""<s>[INST] Analyze this text for psychological insights:
{text}

Output EXACTLY in this JSON format with NO additional text:
{{
    "insights": {{
        "emotional_dynamics": "concise description of emotional shifts",
        "key_triggers": [
            "Positive: [specific trigger]",
            "Negative: [specific trigger]"
        ],
        "physical_reaction": "notable physical response with timing if available",
        "coping_strategies": {{
            "effective": "[specific action]",
            "ineffective": "[specific action]"
        }},
        "recommendations": [
            "concrete suggestion 1",
            "concrete suggestion 2"
        ]
    }}
}}[/INST]"""
    
    # Tokenize and generate
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    outputs = model.generate(
        **inputs,
        max_new_tokens=400,
        temperature=0.3,
        do_sample=True,
        pad_token_id=tokenizer.eos_token_id
    )
    
    # Extract and clean output
    full_output = tokenizer.decode(outputs[0], skip_special_tokens=True)
    json_output = full_output.split("}}[/INST]")[-1].strip()
    return json_output

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
    
with open("ml/outputs/benchmark_results.txt", "a", encoding="utf-8") as f:
    f.write(f"\n\n=== Mistral Instruct Benchmark | {datetime.now()} ===\n")
    # Анализ sample_text_1
    start_time = time.time()
    result = generate_insights(sample_text_1)
    elapsed = time.time() - start_time
    f.write(f"\nAnalysis 1 | Time: {elapsed:.3f}s\n")
    f.write(str(result) + "\n")
    # Анализ sample_text_2
    start_time = time.time()
    result = generate_insights(sample_text_2)
    elapsed = time.time() - start_time
    f.write(f"\nAnalysis 2 | Time: {elapsed:.3f}s\n")
    f.write(str(result) + "\n")
    # Анализ sample_text_3
    start_time = time.time()
    result = generate_insights(sample_text_3)
    elapsed = time.time() - start_time
    f.write(f"\nAnalysis 3 | Time: {elapsed:.3f}s\n")
    f.write(str(result) + "\n")