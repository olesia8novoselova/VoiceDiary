import json
import re
from typing import Any

import torch
from transformers import AutoTokenizer, AutoModelForCausalLM


def clean_output(output) -> dict[str, Any]:
    # удаляем промпт и мусор
    text = re.sub(r'<<SYS>>.*?<</SYS>>\n?', '', output, flags=re.DOTALL)
    text = re.sub(r'\[INST\].*?\[/INST\]\n?', '', text, flags=re.DOTALL)
    normalized_text = (
        text.replace('\\n', ' ')
        .replace('\\"', '"')
        .replace('\\\\', '\\')
        .strip()
    )

    json_match = re.search(r'\{.*\}', normalized_text, re.DOTALL)  # находим реальный джсон
    if not json_match:
        return {}

    json_str = json_match.group(0)

    try:
        return json.loads(json_str)
    except json.JSONDecodeError:
        return {}


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
        return """<<SYS>>You are a psychological analysis assistant. Extract insights from text into this exact JSON format. Be specific and concrete.<</SYS>>

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
```\n\n""" + f"""Text: '''{text}'''
[/INST] """

    def analyze_text(self, input_text, max_new_tokens=500) -> dict[str, Any]:  # 500, чтобы сильно болтать не начал
        prompt = self.create_prompt(input_text)

        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.DEVICE)  # инпут в токены

        # Generate attention mask to fix the warning
        attention_mask = inputs.attention_mask if 'attention_mask' in inputs else None

        output = self.model.generate(
            inputs.input_ids,
            attention_mask=attention_mask,  # Added attention mask
            max_new_tokens=max_new_tokens,
            temperature=0.2,  # Lower for more deterministic output
            do_sample=True,  # чтобы температура работала
            pad_token_id=self.tokenizer.eos_token_id,  # заполнять еос токенами пустые места, чтобы модель не запуталась
            repetition_penalty=1.1  # избегать повторяющихся фраз
        )

        full_output = self.tokenizer.decode(output[0], skip_special_tokens=True)  # токены в аутпут

        return clean_output(full_output)
