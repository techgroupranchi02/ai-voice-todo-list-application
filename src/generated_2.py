import os
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import base64
import re

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or 'your-secret-key-here'
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-string'
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL') or 'sqlite:///todo.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.environ.get('UPLOAD_FOLDER') or './uploads'

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)

# Import models after db initialization
from models import User, Task, Category

# Create tables
with app.app_context():
    db.create_all()

# Helper function to validate email
def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

# Authentication routes
@app.route('/api/v1/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate input
        if not data or not all(k in data for k in ('email', 'password', 'firstName', 'lastName')):
            return jsonify({
                'success': False,
                'error': {
                    'code': 400,
                    'message': 'Missing required fields: email, password, firstName, lastName'
                }
            }), 400
        
        # Validate email
        if not is_valid_email(data['email']):
            return jsonify({
                'success': False,
                'error': {
                    'code': 400,
                    'message': 'The provided email address is invalid.'
                }
            }), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({
                'success': False,
                'error': {
                    'code': 409,
                    'message': 'An account with this email already exists.'
                }
            }), 409
        
        # Create new user
        hashed_password = generate_password_hash(data['password'])
        new_user = User(
            first_name=data['firstName'],
            last_name=data['lastName'],
            email=data['email'],
            password=hashed_password
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': {
                'userId': str(new_user.id),
                'message': 'User registered successfully.'
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': {
                'code': 500,
                'message': 'An error occurred during registration.'
            }
        }), 500

@app.route('/api/v1/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Validate input
        if not data or not all(k in data for k in ('email', 'password')):
            return jsonify({
                'success': False,
                'error': {
                    'code': 400,
                    'message': 'Missing required fields: email, password'
                }
            }), 400
        
        # Find user
        user = User.query.filter_by(email=data['email']).first()
        if not user or not check_password_hash(user.password, data['password']):
            return jsonify({
                'success': False,
                'error': {
                    'code': 401,
                    'message': 'Invalid email or password.'
                }
            }), 401
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'success': True,
            'data': {
                'accessToken': access_token,
                'userId': str(user.id),
                'message': 'Login successful.'
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': {
                'code': 500,
                'message': 'An error occurred during login.'
            }
        }), 500

# Task routes
@app.route('/api/v1/tasks', methods=['POST'])
@jwt_required()
def create_task():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate input
        if not data or not 'title' in data:
            return jsonify({
                'success': False,
                'error': {
                    'code': 400,
                    'message': 'Title cannot be empty.'
                }
            }), 400
        
        # Validate due date format
        due_date = None
        if data.get('dueDate'):
            try:
                due_date = datetime.fromisoformat(data['dueDate'])
            except ValueError:
                return jsonify({
                    'success': False,
                    'error': {
                        'code': 400,
                        'message': 'Invalid date format. Use ISO format (YYYY-MM-DD).'
                    }
                }), 400
        
        # Create task
        new_task = Task(
            user_id=current_user_id,
            title=data['title'],
            description=data.get('description', ''),
            due_date=due_date,
            priority=data.get('priority', 0),
            category_id=data.get('category_id', None),
            completed=False
        )
        
        db.session.add(new_task)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': {
                'taskId': str(new_task.id),
                'message': 'Task created successfully.'
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': {
                'code': 500,
                'message': 'An error occurred while creating the task.'
            }
        }), 500

@app.route('/api/v1/tasks/voice', methods=['POST'])
@jwt_required()
def create_task_from_voice():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate input
        if not data or not 'audioData' in data:
            return jsonify({
                'success': False,
                'error': {
                    'code': 400,
                    'message': 'Audio data is required.'
                }
            }), 400
        
        # Simulate audio processing (in real app, this would call STT service)
        try:
            # Decode base64 audio data
            audio_bytes = base64.b64decode(data['audioData'])
            
            # In a real implementation, we would process the audio here
            # For now, we'll simulate by creating a task with a generic title
            task_title = "Task created from voice input"
            
        except Exception as e:
            return jsonify({
                'success': False,
                'error': {
                    'code': 500,
                    'message': 'Error processing the audio data.'
                }
            }), 500
        
        # Create task
        new_task = Task(
            user_id=current_user_id,
            title=task_title,
            description="Created from voice input",
            due_date=None,
            priority=0,
            category_id=None,
            completed=False
        )
        
        db.session.add(new_task)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': {
                'taskId': str(new_task.id),
                'message': 'Task created from voice input successfully.'
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': {
                'code': 500,
                'message': 'An error occurred while creating task from voice input.'
            }
        }), 500

@app.route('/api/v1/teams/<team_id>/tasks', methods=['POST'])
@jwt_required()
def create_team_task(team_id):
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate input
        if not data or not all(k in data for k in ('title', 'description')):
            return jsonify({
                'success': False,
                'error': {
                    'code': 400,
                    'message': 'Missing required fields: title, description'
                }
            }), 400
        
        # Validate due date format
        due_date = None
        if data.get('dueDate'):
            try:
                due_date = datetime.fromisoformat(data['dueDate'])
            except ValueError:
                return jsonify({
                    'success': False,
                    'error': {
                        'code': 400,
                        'message': 'Invalid date format. Use ISO format (YYYY-MM-DD).'
                    }
                }), 400
        
        # Create task
        new_task = Task(
            user_id=current_user_id,
            title=data['title'],
            description=data['description'],
            due_date=due_date,
            priority=data.get('priority', 0),
            category_id=data.get('category_id', None),
            completed=False
        )
        
        db.session.add(new_task)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': {
                'taskId': str(new_task.id),
                'message': 'Task created successfully.'
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': {
                'code': 500,
                'message': 'An error occurred while creating the team task.'
            }
        }), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': {
            'code': 404,
            'message': 'Endpoint not found.'
        }
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': {
            'code': 500,
            'message': 'Internal server error.'
        }
    }), 500

if __name__ == '__main__':
    app.run(debug=True)