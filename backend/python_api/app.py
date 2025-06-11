from fastapi import FastAPI
from pydantic import BaseModel

# Создаем экземпляр приложения FastAPI
app = FastAPI(
    title="My FastAPI App",
    description="This is a sample FastAPI application with Swagger documentation",
    version="0.1.0",
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc",
)

# Модель Pydantic для запроса/ответа
class Item(BaseModel):
    name: str
    description: str | None = None
    #TODO: описание объекта

# Пример GET endpoint
@app.get("/", tags=["Root"])
async def read_root():
    """Root endpoint that returns a welcome message"""
    return {"message": "Welcome to FastAPI with Swagger"}

# Пример GET endpoint с параметром пути
@app.get("/items/{item_id}", tags=["Items"])
async def read_item(item_id: int, q: str | None = None):
    """Get item by ID with optional query parameter"""
    return {"item_id": item_id, "q": q}

# Пример POST endpoint с телом запроса
@app.post("/items/", tags=["Items"])
async def create_item(item: Item):
    """Create a new item with the given data"""
    return {"item_name": item.name}

# Пример PUT endpoint
@app.put("/items/{item_id}", tags=["Items"])
async def update_item(item_id: int, item: Item):
    """Update an existing item"""
    return {"item_id": item_id, "updated_item": item.dict()}

# Пример DELETE endpoint
@app.delete("/items/{item_id}", tags=["Items"])
async def delete_item(item_id: int):
    """Delete an item by ID"""
    return {"message": f"Item {item_id} deleted"}