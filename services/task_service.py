# services/task_service.py
"""
Task service for the AI Voice Todo List Application
"""

from models.task import Task
from models.user import User
from models.category import Category
from models import db

class TaskService:
    @staticmethod
    def get_user_tasks(user_id):
        """Get all tasks for a specific user"""
        return Task.query.filter_by(user_id=user_id).all()
    
    @staticmethod
    def get_task_by_id(task_id):
        """Get a specific task by ID"""
        return Task.query.get(task_id)
    
    @staticmethod
    def update_task(task_id, data):
        """Update a task with new data"""
        task = Task.query.get(task_id)
        if not task:
            return None
        
        for key, value in data.items():
            setattr(task, key, value)
        
        db.session.commit()
        return task
    
    @staticmethod
    def delete_task(task_id):
        """Delete a task"""
        task = Task.query.get(task_id)
        if task:
            db.session.delete(task)
            db.session.commit()
            return True
        return False