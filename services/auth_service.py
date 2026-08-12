# services/auth_service.py
"""
Authentication service for the AI Voice Todo List Application
"""

from models.user import User
from models import db
import jwt
from datetime import datetime, timedelta
from config import Config

class AuthService:
    @staticmethod
    def authenticate_user(email, password):
        """Authenticate a user with email and password"""
        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            return user
        return None
    
    @staticmethod
    def generate_token(user_id):
        """Generate JWT token for user"""
        payload = {
            'user_id': str(user_id),
            'exp': datetime.utcnow() + timedelta(hours=1)
        }
        return jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm='HS256')
    
    @staticmethod
    def verify_token(token):
        """Verify JWT token and return user ID"""
        try:
            payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
            return payload['user_id']
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None