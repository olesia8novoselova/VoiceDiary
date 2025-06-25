import os
from typing import Annotated
from uuid import uuid4

from fastapi import FastAPI, File

from backend.python_api.emotion_recognition_model import EmotionRecognitionModel
from backend.python_api.transcription_model import TranscriptionModel

emotion_recognition_model = EmotionRecognitionModel()
transcription_model = TranscriptionModel()

app = FastAPI(
    title="VoiceDiaryML",
    description="ML part for emotion recognition",
    version="0.1.0",
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc",
)

@app.post("/analyze")
async def analyze_record(record: Annotated[bytes, File()]) -> dict[str, str]:
    audio_path = f"{uuid4()}.mp3"
    open(audio_path, "w").write(record)

    res = {
        "emotion": emotion_recognition_model.get_emotion(audio_path),
        "summary": transcription_model.get_summarization(audio_path),
    }

    os.remove(audio_path)

    return res