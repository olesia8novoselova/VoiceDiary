FROM pytorch/pytorch:2.7.1-cuda12.8-cudnn9-runtime AS builder
WORKDIR /app

RUN apt-get update \
    && apt-get install gcc ffmpeg -y \
    && apt-get clean

RUN pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu128
RUN pip install uvicorn fastapi librosa transformers[torch] openai-whisper python-multipart sentencepiece

COPY . /app/python_api