from flask import Blueprint, request, jsonify
from app import db
from models import Task, User
from flask_jwt_extended import jwt_required, get_jwt_identity
import base64
from datetime import datetime
import logging

tasks_bp = Blueprint('tasks', __name__)
logger = logging.getLogger(__name__)

def validate_task_data(data):
    """Validate task data"""
    if not data.get('title'):
        return False, "Title cannot be empty."
    
    # Validate due date format if provided
    if 'dueDate' in data and data['dueDate']:
        try:
            datetime.fromisoformat(data['dueDate'].replace('Z', '+00:00'))
        except ValueError:
            return False, "Invalid due date format. Use ISO format (YYYY-MM-DD)."
    
    # Validate priority
    if 'priority' in data and data['priority'] not in [1, 2, 3]:
        return False, "Priority must be 1 (Low), 2 (Medium), or 3 (High)."
    
    return True, None

@tasks_bp.route('', methods=['POST'])
@jwt_required()
def create_task():
    try:
        data = request.get_json()
        
        # Validate task data
        is_valid, error_message = validate_task_data(data)
        if not is_valid:
            return jsonify({
                "success": False,
                "error": error_message
            }), 400
        
        current_user_id = get_jwt_identity()
        
        # Create new task
        task = Task(
            user_id=current_user_id,
            title=data['title'],
            description=data.get('description'),
            due_date=datetime.fromisoformat(data['dueDate'].replace('Z', '+00:00')) if data.get('dueDate') else None,
            priority=data.get('priority', 2),  # Default to Medium
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
        logger.error(f"Error creating task: {str(e)}")
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": "Failed to create task"
        }), 500

@tasks_bp.route('/voice', methods=['POST'])
@jwt_required()
def create_task_from_voice():
    try:
        data = request.get_json()
        
        # Validate audio data
        if not data or 'audioData' not in data:
            return jsonify({
                "success": False,
                "error": "Audio data is required."
            }), 400
        
        audio_data = data['audioData']
        
        # Validate audio size (should be base64 encoded)
        try:
            decoded_audio = base64.b64decode(audio_data)
            if len(decoded_audio) > 10 * 1024 * 1024:  # 10MB limit
                return jsonify({
                    "success": False,
                    "error": "Audio file too large. Maximum size is 10MB."
                }), 400
        except Exception:
            return jsonify({
                "success": False,
                "error": "Invalid audio data format."
            }), 400
        
        # Simulate voice processing (in a real app, this would call an ASR service)
        # For demo purposes, we'll just create a task with a placeholder title
        current_user_id = get_jwt_identity()
        
        task = Task(
            user_id=current_user_id,
            title="Voice Task - Processed",
            description="Task created from voice input",
            due_date=datetime.utcnow(),
            priority=2
        )
        
        db.session.add(task)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "data": {
                "taskId": task.id,
                "message": "Task created from voice input successfully."
            }
        }), 201
        
    except Exception as e:
        logger.error(f"Error processing voice task: {str(e)}")
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": "Error processing the audio data."
        }), 500