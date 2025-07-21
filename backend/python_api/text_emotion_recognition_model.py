from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F


class TextEmotionRecognitionModel:
    MODEL_NAME = "j-hartmann/emotion-english-distilroberta-base"

    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained(self.MODEL_NAME)
        self.model = AutoModelForSequenceClassification.from_pretrained(self.MODEL_NAME)

    def predict_emotion(self, text) -> tuple[str, list]:
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True)
        with torch.no_grad():
            outputs = self.model(**inputs)
            probs = F.softmax(outputs.logits, dim=1)
        predicted_class = torch.argmax(probs, dim=1).item()
        labels = self.model.config.id2label
        return labels[predicted_class], probs.squeeze().tolist()