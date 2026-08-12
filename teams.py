from flask import Blueprint, request, jsonify
from app import db
from models import Task, User, Category
from flask_jwt_extended import jwt_required, get_jwt_identity
import logging

teams_bp = Blueprint('teams', __name__)
logger = logging.getLogger(__name__)

@teams_bp.route('/<int:team_id>/tasks', methods=['POST'])
@jwt_required()
def create_team_task(team_id):
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(key in data for key in ['title']):
            return jsonify({
                "success": False,
                "error": "Title is required."
            }), 400
        
        current_user_id = get_jwt_identity()
        
        # In a real implementation, we would validate:
        # 1. Team exists
        # 2. User has permission to create tasks for this team
        # For demo purposes, we'll just create the task without team validation
        
        # Create new task
        task = Task(
            user_id=current_user_id,
            title=data['title'],
            description=data.get('description'),
            due_date=data.get('dueDate'),
            priority=data.get('priority', 2),
            category_id=data.get('category')
        )
        
        db.session.add(task)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "data": {
                "taskId": task.id,
                "message": "Task created successfully."
            }
        }), 201
        
    except Exception as e:
        logger.error(f"Error creating team task: {str(e)}")
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": "Failed to create team task"
        }), 500