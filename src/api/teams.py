# src/api/teams.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from database.db import get_db
from models.task import Task
from models.user import User

router = APIRouter()

class CreateTeamTaskRequest(BaseModel):
    title: str
    description: str = None
    dueDate: datetime = None
    priority: int = 2  # Default to Medium
    assigneeId: str = None

class CreateTeamTaskResponse(BaseModel):
    success: bool
    data: dict

@router.post("/{team_id}/tasks", response_model=CreateTeamTaskResponse)
async def create_team_task(
    team_id: str,
    request: CreateTeamTaskRequest, 
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
        user_id=request.assigneeId if request.assigneeId else current_user.id if current_user else 1,
        title=request.title,
        description=request.description,
        due_date=request.dueDate,
        priority=request.priority,
        category_id=None
    )
    
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    
    return CreateTeamTaskResponse(
        success=True,
        data={
            "taskId": str(new_task.id),
            "message": "Task created successfully."
        }
    )