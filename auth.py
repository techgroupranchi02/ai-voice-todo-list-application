from flask import Blueprint, request, jsonify
from app import db, jwt
from models import User
import re
from werkzeug.security import generate_password_hash
from flask_jwt_extended import create_access_token, get_jwt_identity
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(key in data for key in ['email', 'password', 'firstName', 'lastName']):
            return jsonify({
                "success": False,
                "error": "Missing required fields"
            }), 400
        
        email = data['email']
        password = data['password']
        first_name = data['firstName']
        last_name = data['lastName']
        
        # Validate email format
        if not validate_email(email):
            return jsonify({
                "success": False,
                "error": "The provided email address is invalid."
            }), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({
                "success": False,
                "error": "An account with this email already exists."
            }), 409
        
        # Create new user
        user = User(
            first_name=first_name,
            last_name=last_name,
            email=email
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "data": {
                "userId": user.id,
                "message": "User registered successfully."
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": "Registration failed"
        }), 500