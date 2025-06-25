import time

import whisper


class TranscriptionModel:
    MODEL_ID = "large-v3"
    DETECTOR_MODEL_ID = "large-v3"

    def __init__(self):
        self.model = whisper.load_model(self.MODEL_ID)
        self.detector_model = whisper.load_model(self.DETECTOR_MODEL_ID)

    def detect_language(self, audio_path):
        audio = whisper.load_audio(audio_path)
        audio = whisper.pad_or_trim(audio)
        mel = whisper.log_mel_spectrogram(audio, n_mels=self.detector_model.dims.n_mels).to(self.detector_model.device)
        _, probs = self.detector_model.detect_language(mel)
        detected_lang = max(probs, key=probs.get)
        return detected_lang

    def get_transcription(self, audio_path):
        detected_lang = self.detect_language(audio_path)

        return (
            self.model.transcribe(audio_path, language=detected_lang) if detected_lang == "en" else
            self.model.transcribe(audio_path, task="translate", language=detected_lang)
        )["text"]
