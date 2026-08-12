# src/api/tasks.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from database.db import get_db
from models.task import Task
from models.user import User

router = APIRouter()

class CreateTaskRequest(BaseModel):
    title: str
    description: str = None
    dueDate: datetime = None
    priority: int = 2  # Default to Medium
    category: str = None

class CreateTaskResponse(BaseModel):
    success: bool
    data: dict

@router.post("/", response_model=CreateTaskResponse)
async def create_task(
    request: CreateTaskRequest, 
    db: Session = Depends(get_db),
    current_user: User = Depends(lambda: None)  # In real implementation, this would be authenticated user
):
    # Validate title
    if not request.title or not request.title.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title cannot be empty."
        )
    
    # Create task
    new_task = Task(
        user_id=current_user.id if current_user else 1,  # Placeholder for authenticated user
        title=request.title,
        description=request.description,
        due_date=request.dueDate,
        priority=request.priority,
        category_id=None  # Would be set based on category name if provided
    )
    
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    
    return CreateTaskResponse(
        success=True,
        data={
            "taskId": str(new_task.id),
            "message": "Task created successfully."
        }
    )

@router.post("/voice", response_model=CreateTaskResponse)
async def create_task_from_voice(
    request: dict,  # Would be actual audio data in real implementation
    db: Session = Depends(get_db),
    current_user: User = Depends(lambda: None)  # In real implementation, this would be authenticated user
):
    try:
        # In a real implementation, this would process the audio data
        # For now, we'll simulate processing
        
        # Simulate voice-to-text conversion and task creation
        task_title = "Voice Task from Audio Input"
        new_task = Task(
            user_id=current_user.id if current_user else 1,
            title=task_title,
            description="Created from voice input",
            due_date=datetime.now(),
            priority=2,
            category_id=None
        )
        
        db.add(new_task)
        db.commit()
        db.refresh(new_task)
        
        return CreateTaskResponse(
            success=True,
            data={
                "taskId": str(new_task.id),
                "message": "Task created from voice input successfully."
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error processing the audio data."
        )