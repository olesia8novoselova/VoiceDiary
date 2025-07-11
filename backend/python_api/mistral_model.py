import json

import torch
from transformers import AutoTokenizer, AutoModelForCausalLM


class InsightsModel:
    MODEL_NAME = "teknium/OpenHermes-2.5-Mistral-7B"  # быстрее "TheBloke/OpenHermes-2.5-Mistral-7B-GPTQ"
    DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
    TORCH_DTYPE = torch.float16 if DEVICE == "cuda" else torch.float32

    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained(
            self.MODEL_NAME,
            use_fast=False,  # avoid tiktoken issues - we use it for whisper
            trust_remote_code=True
        )
        self.model = AutoModelForCausalLM.from_pretrained(
            self.MODEL_NAME,
            torch_dtype=self.TORCH_DTYPE,
            device_map="auto",
            trust_remote_code=True
        )

    def create_prompt(self, text):
        return f"""<<SYS>>You are a psychological analysis assistant. Extract insights from text into this exact JSON format:<</SYS>>

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

    def analyze_text(self, text, max_new_tokens=500):  # 500, чтобы сильно болтать не начал
        prompt = self.create_prompt(text)

        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.DEVICE)  # инпут в токены

        output = self.model.generate(
            inputs.input_ids,
            max_new_tokens=max_new_tokens,
            temperature=0.2,  # Lower for more deterministic output
            do_sample=True,  # чтобы температура работала
            pad_token_id=self.tokenizer.eos_token_id,  # заполнять еос токенами пустые места, чтобы модель не запуталась
            repetition_penalty=1.1  # избегать повторяющихся фраз
        )

        full_output = self.tokenizer.decode(output[0], skip_special_tokens=True)  # токены в аутпут

        json_str = full_output.split('{', 1)[1].rsplit('}', 1)[0]
        json_str = '{' + json_str + '}'
        if "<<SYS>>" in json_str:
            json_str = json_str.split("<<SYS>>")[1]
        if "[SOL]" in json_str:
            json_str = json_str.split("[SOL]")[1]
        if "<|im_sep|>" in json_str:
            json_str = json_str.split("<|im_sep|>")[1]
        json_data = json.loads(json_str)
        return json_data
