import torch
import torchaudio
from transformers import Wav2Vec2Processor, Wav2Vec2ForSequenceClassification
import numpy as np

# Путь к модели и аудио
model_path = "ml/wav2vec2-dusha-finetuned"
audio_path = "ml/audio_samples/Back_Home.wav"  # замените на путь к вашему файлу

# Загрузка процессора и модели
processor = Wav2Vec2Processor.from_pretrained(model_path)
model = Wav2Vec2ForSequenceClassification.from_pretrained(model_path)

# Устройство (GPU/CPU)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# Загрузка аудио (torchaudio автоматически читает сэмплингрейт)
speech_array, sampling_rate = torchaudio.load(audio_path)

# Приведение к 16kHz при необходимости
if sampling_rate != 16000:
    resampler = torchaudio.transforms.Resample(orig_freq=sampling_rate, new_freq=16000)
    speech_array = resampler(speech_array)

# Убираем второй канал, если есть
if speech_array.shape[0] > 1:
    speech_array = torch.mean(speech_array, dim=0, keepdim=True)

# Преобразуем в 1D
speech = speech_array.squeeze().numpy()

# Препроцессинг
inputs = processor(speech, sampling_rate=16000, return_tensors="pt", padding=True)

# На нужное устройство
inputs = {k: v.to(device) for k, v in inputs.items()}

# Предсказание
with torch.no_grad():
    logits = model(**inputs).logits

# Получаем индекс класса
predicted_class_id = torch.argmax(logits, dim=-1).item()

# Получаем имя метки, если оно есть в config
label_map = model.config.id2label
predicted_label = label_map.get(predicted_class_id, f"Label {predicted_class_id}")

print(f"Предсказанная эмоция: {predicted_label}")