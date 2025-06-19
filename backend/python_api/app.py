from typing import Any

from fastapi import FastAPI
from pydantic import BaseModel

from backend.python_api.model import Model

model = Model()

# Создаем экземпляр приложения FastAPI
app = FastAPI(
    title="My FastAPI App",
    description="This is a sample FastAPI application with Swagger documentation",
    version="0.1.0",
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc",
)

class Record(BaseModel):
    record_id: str
    record: str | None = None
    #TODO: описание объекта

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to FastAPI with Swagger"}

@app.get("/items/{item_id}", tags=["Items"])
async def read_item(record_id: str, record: Any):
    return {"record_id": record_id, "emotion": model.get_emotion(record)}