# utils/validators.py
"""
Validation utilities for the AI Voice Todo List Application
"""

import re
from datetime import datetime

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password complexity"""
    if len(password) < 8:
        return False
    
    has_upper = re.search(r'[A-Z]', password)
    has_lower = re.search(r'[a-z]', password)
    has_digit = re.search(r'\d', password)
    
    return all([has_upper, has_lower, has_digit])

def validate_task_data(data):
    """Validate task creation data"""
    if not data.get('title'):
        return {
            'valid': False,
            'message': 'Title cannot be empty.'
        }
    
    # Validate due date if provided
    if data.get('dueDate'):
        try:
            due_date = datetime.fromisoformat(data['dueDate'].replace('Z', '+00:00'))
            if due_date < datetime.utcnow():
                return {
                    'valid': False,
                    'message': 'Due date must be in the future.'
                }
        except ValueError:
            return {
                'valid': False,
                'message': 'Invalid due date format.'
            }
    
    # Validate priority
    if data.get('priority') is not None:
        if data['priority'] not in [1, 2, 3]:
            return {
                'valid': False,
                'message': 'Priority must be 1 (Low), 2 (Medium), or 3 (High).'
            }
    
    return {
        'valid': True,
        'message': 'Valid task data'
    }