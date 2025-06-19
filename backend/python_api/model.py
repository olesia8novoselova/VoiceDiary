from typing import Any

import torch
import torchaudio
from transformers import AutoFeatureExtractor, Wav2Vec2ForSequenceClassification

class Model:
    def __init__(self):
        self.extractor = AutoFeatureExtractor.from_pretrained("ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition")
        self.model = Wav2Vec2ForSequenceClassification.from_pretrained("ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition")

    def get_emotion(self, record: Any):
        # TODO: use record from request not presaved file
        waveform, sr = torchaudio.load("ml/audio_samples/Back_Home.wav")
        if sr != 16000:
            waveform = torchaudio.transforms.Resample(orig_freq=sr, new_freq=16000)(waveform)
        speech = waveform[0].numpy()

        inputs = self.extractor(speech, sampling_rate=16000, return_tensors="pt", padding=True)

        with torch.no_grad():
            logits = self.model(**inputs).logits

        pred_id = int(torch.argmax(logits))
        emotion = self.model.config.id2label[pred_id]

        return emotion
