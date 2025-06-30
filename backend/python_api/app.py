import os
from uuid import uuid4

from fastapi import FastAPI, File, UploadFile

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
async def analyze_record(file: UploadFile = File(...)) -> dict[str, str]:
    audio_path = f"{uuid4()}.wav"
    with open(audio_path, "wb") as f:
        content = await file.read()
        f.write(content)

    res = {
        "emotion": emotion_recognition_model.get_emotion(audio_path),
        "summary": transcription_model.get_summarization(audio_path),
    }

    os.remove(audio_path)

    return res