import torch
import torchaudio
from transformers import AutoFeatureExtractor, Wav2Vec2ForSequenceClassification

# Загружаем модель и extractor (НЕ processor!)
extractor = AutoFeatureExtractor.from_pretrained("ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition")
model = Wav2Vec2ForSequenceClassification.from_pretrained("ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition")

# Загружаем и ресемплим аудио
waveform, sr = torchaudio.load("ml/audio_samples/Back_Home.wav")
if sr != 16000:
    waveform = torchaudio.transforms.Resample(orig_freq=sr, new_freq=16000)(waveform)
speech = waveform[0].numpy()

# Предобработка
inputs = extractor(speech, sampling_rate=16000, return_tensors="pt", padding=True)

# Предсказание
with torch.no_grad():
    logits = model(**inputs).logits

pred_id = int(torch.argmax(logits))
emotion = model.config.id2label[pred_id]

print(f"Распознанная эмоция: {emotion}")
