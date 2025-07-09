from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F

# Загрузка модели и токенизатора
model_name = "j-hartmann/emotion-english-distilroberta-base"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

# Функция предсказания
def predict_emotion(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True)
    with torch.no_grad():
        outputs = model(**inputs)
        probs = F.softmax(outputs.logits, dim=1)
    predicted_class = torch.argmax(probs, dim=1).item()
    labels = model.config.id2label
    return labels[predicted_class], probs.squeeze().tolist()

text = "I'm feeling really happy and excited today!"
label, scores = predict_emotion(text)
print(f"Predicted Emotion: {label}")
