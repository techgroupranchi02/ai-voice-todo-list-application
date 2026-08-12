# src/main.py
import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database.db import engine, Base
from models.user import User
from models.task import Task
from models.category import Category
from api.auth import router as auth_router
from api.tasks import router as tasks_router
from api.teams import router as teams_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Voice Todo List API",
    description="Backend for AI Voice Todo List Application",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(tasks_router, prefix="/api/v1/tasks", tags=["Tasks"])
app.include_router(teams_router, prefix="/api/v1/teams", tags=["Teams"])

@app.get("/")
async def root():
    return {"message": "AI Voice Todo List API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)