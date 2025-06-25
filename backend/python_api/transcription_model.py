import whisper
from transformers import pipeline


class TranscriptionModel:
    MODEL_ID = "large-v3"
    SUMMARIZER_ID = "philschmid/bart-large-cnn-samsum"

    def __init__(self):
        self.model = whisper.load_model(self.MODEL_ID)
        self.summarizer = pipeline("summarization", model=self.SUMMARIZER_ID)

    def get_transcription(self, audio_path: str):
         return self.model.transcribe(audio_path)["text"]

    def get_summarization(self, audio_path: str):
        return self.summarizer(
            self.get_transcription(audio_path),
            min_length=20,
            max_legth=50,
            do_sample=False
        )[0]["summary_text"]
