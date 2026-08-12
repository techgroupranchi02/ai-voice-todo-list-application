# api/auth.py
"""
Authentication API endpoints for the AI Voice Todo List Application
"""

from flask import Blueprint, request, jsonify
from models.user import User
from models import db
from services.auth_service import AuthService
from utils.validators import validate_email, validate_password

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate input
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        required_fields = ['email', 'password', 'firstName', 'lastName']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({
                    'success': False,
                    'error': f'{field.replace("_", " ").title()} is required'
                }), 400
        
        # Validate email
        if not validate_email(data['email']):
            return jsonify({
                'success': False,
                'error': 'The provided email address is invalid.'
            }), 400
        
        # Validate password
        if not validate_password(data['password']):
            return jsonify({
                'success': False,
                'error': 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit.'
            }), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({
                'success': False,
                'error': 'An account with this email already exists.'
            }), 409
        
        # Create new user
        user = User(
            first_name=data['firstName'],
            last_name=data['lastName'],
            email=data['email']
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': {
                'userId': str(user.id),
                'message': 'User registered successfully.'
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': 'An error occurred during registration'
        }), 500