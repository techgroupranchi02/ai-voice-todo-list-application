# src/services/task_service.py
from sqlalchemy.orm import Session
from models.task import Task
from datetime import datetime

class TaskService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_task(self, user_id: int, title: str, description: str = None, 
                   due_date: datetime = None, priority: int = 2, category_id: int = None) -> Task:
        task = Task(
            user_id=user_id,
            title=title,
            description=description,
            due_date=due_date,
            priority=priority,
            category_id=category_id
        )
        self.db.add(task)
        self.db.commit()
        self.db.refresh(task)
        return task
    
    def get_user_tasks(self, user_id: int) -> list:
        return self.db.query(Task).filter(Task.user_id == user_id).all()
    
    def get_task_by_id(self, task_id: int) -> Task:
        return self.db.query(Task).filter(Task.id == task_id).first()