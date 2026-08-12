# api/tasks.py
"""
Task management API endpoints for the AI Voice Todo List Application
"""

from flask import Blueprint, request, jsonify
from models.task import Task
from models.user import User
from models import db
from services.task_service import TaskService
from utils.validators import validate_task_data

tasks_bp = Blueprint('tasks', __name__)

@tasks_bp.route('/', methods=['POST'])
def create_task():
    """Create a new task (manual entry)"""
    try:
        data = request.get_json()
        
        # Validate input
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        # Validate task data
        validation_result = validate_task_data(data)
        if not validation_result['valid']:
            return jsonify({
                'success': False,
                'error': validation_result['message']
            }), 400
        
        # Create task
        task = Task(
            user_id=data.get('userId'),
            title=data['title'],
            description=data.get('description'),
            due_date=data.get('dueDate'),
            priority=data.get('priority', 2),  # Default to medium priority
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

@tasks_bp.route('/voice', methods=['POST'])
def create_task_from_voice():
    """Create a new task from voice input"""
    try:
        data = request.get_json()
        
        # Validate input
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        if 'audioData' not in data:
            return jsonify({
                'success': False,
                'error': 'Audio data is required'
            }), 400
        
        # In a real implementation, we would process the audio here
        # For this example, we'll simulate processing
        task_title = "Voice Task from Audio Input"
        
        # Create task with simulated title
        task = Task(
            user_id=data.get('userId'),
            title=task_title,
            description="Created from voice input",
            priority=2  # Default to medium priority
        )
        
        db.session.add(task)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': {
                'taskId': str(task.id),
                'message': 'Task created from voice input successfully.'
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': 'Error processing the audio data.'
        }), 500