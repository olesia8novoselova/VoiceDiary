import whisper
from transformers import pipeline


class TranscriptionModel:
    MODEL_ID = "large-v3"
    SUMMARIZER_ID = "philschmid/bart-large-cnn-samsum"

    def __init__(self):
        self.model = whisper.load_model(self.MODEL_ID)
        self.summarizer = pipeline("summarization", model=self.SUMMARIZER_ID)

    def detect_language(self, audio_path):
        audio = whisper.load_audio(audio_path)
        audio = whisper.pad_or_trim(audio)
        mel = whisper.log_mel_spectrogram(audio, n_mels=self.model.dims.n_mels).to(self.model.device)
        _, probs = self.model.detect_language(mel)
        detected_lang = max(probs, key=probs.get)
        return detected_lang

    def get_transcription(self, audio_path):
        detected_lang = self.detect_language(audio_path)

        return (
            self.model.transcribe(audio_path, language=detected_lang) if detected_lang == "en" else
            self.model.transcribe(audio_path, task="translate", language=detected_lang)
        )["text"]

    def get_summarization(self, audio_path: str):
        transcription = self.get_transcription(audio_path)
        summary = self.summarizer(
            transcription,
            min_length=10,
            max_length=150,
            do_sample=False
        )[0]["summary_text"]

        return transcription, summary

    def get_summarization_from_text(self, text: str):
        summary = self.summarizer(
            text,
            min_length=10,
            max_length=150,
            do_sample=False
        )[0]["summary_text"]

        return summary
