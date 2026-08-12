# api/teams.py
"""
Team management API endpoints for the AI Voice Todo List Application
"""

from flask import Blueprint, request, jsonify
from models.task import Task
from models.user import User
from models import db

teams_bp = Blueprint('teams', __name__)

@teams_bp.route('/<int:team_id>/tasks', methods=['POST'])
def create_team_task(team_id):
    """Create a task within a team"""
    try:
        data = request.get_json()
        
        # Validate input
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        required_fields = ['title', 'description', 'dueDate', 'priority']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({
                    'success': False,
                    'error': f'{field.replace("_", " ").title()} is required'
                }), 400
        
        # Create task
        task = Task(
            user_id=data.get('assigneeId'),
            title=data['title'],
            description=data['description'],
            due_date=data['dueDate'],
            priority=data['priority'],
            category_id=data.get('categoryId')
        )
        
        db.session.add(task)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': {
                'taskId': str(task.id),
                'message': 'Task created successfully.'
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': 'An error occurred while creating the task'
        }), 500