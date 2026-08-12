# app.py
import os
import logging
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import re

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Configuration from environment variables
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
if not app.config['SECRET_KEY']:
    raise ValueError("SECRET_KEY must be set in environment variables")

app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
if not app.config['JWT_SECRET_KEY']:
    raise ValueError("JWT_SECRET_KEY must be set in environment variables")

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///todo.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600  # 1 hour

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# Import models after db initialization
from models import User, Task, Category

# Email validation regex (simplified for this implementation)
def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

# Authentication routes
@app.route('/api/v1/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(key in data for key in ['email', 'password', 'firstName', 'lastName']):
            return jsonify({
                'success': False,
                'error': 'Missing required fields: email, password, firstName, lastName'
            }), 400
        
        email = data['email']
        password = data['password']
        first_name = data['firstName']
        last_name = data['lastName']
        
        # Validate email format
        if not is_valid_email(email):
            return jsonify({
                'success': False,
                'error': 'The provided email address is invalid.'
            }), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({
                'success': False,
                'error': 'An account with this email already exists.'
            }), 409
        
        # Create new user
        hashed_password = generate_password_hash(password)
        new_user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
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
        logger.error(f"Registration error: {str(e)}")
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': 'An internal server error occurred.'
        }), 500

@app.route('/api/v1/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(key in data for key in ['email', 'password']):
            return jsonify({
                'success': False,
                'error': 'Missing required fields: email, password'
            }), 400
        
        email = data['email']
        password = data['password']
        
        # Find user
        user = User.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password, password):
            return jsonify({
                'success': False,
                'error': 'Invalid email or password.'
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
        logger.error(f"Login error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An internal server error occurred.'
        }), 500

# Task routes
@app.route('/api/v1/tasks', methods=['POST'])
@jwt_required()
def create_task():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        if not all(key in data for key in ['title']):
            return jsonify({
                'success': False,
                'error': 'Title cannot be empty.'
            }), 400
        
        title = data['title']
        description = data.get('description', '')
        due_date = data.get('dueDate')
        priority = data.get('priority', 'Medium')
        category = data.get('category', 'Personal')
        
        # Validate priority
        valid_priorities = ['Low', 'Medium', 'High']
        if priority not in valid_priorities:
            return jsonify({
                'success': False,
                'error': f'Invalid priority. Must be one of: {", ".join(valid_priorities)}'
            }), 400
        
        # Validate due date
        if due_date:
            try:
                due_date = datetime.fromisoformat(due_date)
            except ValueError:
                return jsonify({
                    'success': False,
                    'error': 'Invalid due date format. Use ISO format (YYYY-MM-DD).'
                }), 400
        
        # Create task
        new_task = Task(
            user_id=current_user_id,
            title=title,
            description=description,
            due_date=due_date,
            priority=priority,
            category=category
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
        logger.error(f"Create task error: {str(e)}")
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': 'An internal server error occurred.'
        }), 500

@app.route('/api/v1/tasks/voice', methods=['POST'])
@jwt_required()
def create_task_from_voice():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        if 'audioData' not in data:
            return jsonify({
                'success': False,
                'error': 'Audio data is required.'
            }), 400
        
        audio_data = data['audioData']
        
        # In a real implementation, this would process the audio data
        # For demo purposes, we'll simulate processing
        if not isinstance(audio_data, str) or len(audio_data) == 0:
            return jsonify({
                'success': False,
                'error': 'Invalid audio data.'
            }), 400
        
        # Simulate audio processing - in reality this would call a speech-to-text service
        # For demo purposes, we'll create a simple task based on audio content
        title = "Voice Task"
        description = "Created from voice input"
        
        new_task = Task(
            user_id=current_user_id,
            title=title,
            description=description,
            priority="Medium",
            category="Personal"
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
        logger.error(f"Create task from voice error: {str(e)}")
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': 'Error processing the audio data.'
        }), 500

@app.route('/api/v1/teams/<team_id>/tasks', methods=['POST'])
@jwt_required()
def create_team_task(team_id):
    try:
        current_user_id = get_jwt_identity()
        
        # In a real implementation, we would verify team membership here
        # For this demo, we'll assume the user has access to the team
        
        data = request.get_json()
        
        # Validate required fields
        if not all(key in data for key in ['title']):
            return jsonify({
                'success': False,
                'error': 'Title cannot be empty.'
            }), 400
        
        title = data['title']
        description = data.get('description', '')
        due_date = data.get('dueDate')
        priority = data.get('priority', 'Medium')
        assignee_id = data.get('assigneeId')
        
        # Validate priority
        valid_priorities = ['Low', 'Medium', 'High']
        if priority not in valid_priorities:
            return jsonify({
                'success': False,
                'error': f'Invalid priority. Must be one of: {", ".join(valid_priorities)}'
            }), 400
        
        # Validate due date
        if due_date:
            try:
                due_date = datetime.fromisoformat(due_date)
            except ValueError:
                return jsonify({
                    'success': False,
                    'error': 'Invalid due date format. Use ISO format (YYYY-MM-DD).'
                }), 400
        
        # Create task
        new_task = Task(
            user_id=assignee_id or current_user_id,  # Assign to assignee or current user
            title=title,
            description=description,
            due_date=due_date,
            priority=priority,
            category="Team"
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
        logger.error(f"Create team task error: {str(e)}")
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': 'An internal server error occurred.'
        }), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found.'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({
        'success': False,
        'error': 'An internal server error occurred.'
    }), 500

if __name__ == '__main__':
    # Create tables
    with app.app_context():
        db.create_all()
    
    # Run the application
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(debug=debug_mode, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))