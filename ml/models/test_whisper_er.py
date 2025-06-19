from transformers import AutoModelForAudioClassification, AutoFeatureExtractor
import librosa
import torch
import numpy as np

# Load model and feature extractor
model_id = "firdhokk/speech-emotion-recognition-with-openai-whisper-large-v3"
model = AutoModelForAudioClassification.from_pretrained(model_id)
feature_extractor = AutoFeatureExtractor.from_pretrained(model_id, do_normalize=True)
id2label = model.config.id2label

audio_files = [
    "ml/audio_samples/natalia.wav"
]

def predict_emotion(audio_path):
    # Preprocess
    audio, sr = librosa.load(audio_path, sr=feature_extractor.sampling_rate)
    inputs = feature_extractor(audio, sampling_rate=sr, return_tensors="pt")
    
    # Predict
    with torch.no_grad():
        outputs = model(**inputs)
    
    # Get predicted label
    predicted_id = torch.argmax(outputs.logits, dim=-1).item()
    return id2label[predicted_id]

# Test each audio file
for audio_file in audio_files:
    emotion = predict_emotion(audio_file)
    print(f"File: {audio_file} | Predicted Emotion: {emotion}")