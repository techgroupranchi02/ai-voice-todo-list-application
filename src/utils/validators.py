# src/utils/validators.py
import re
from typing import Optional

def validate_email(email: str) -> bool:
    """
    Validate email address format.
    
    Args:
        email (str): Email to validate
        
    Returns:
        bool: True if valid, False otherwise
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password: str) -> bool:
    """
    Validate password strength.
    
    Args:
        password (str): Password to validate
        
    Returns:
        bool: True if valid, False otherwise
    """
    # At least 8 characters, one uppercase, one lowercase, one digit
    if len(password) < 8:
        return False
    
    has_upper = re.search(r'[A-Z]', password)
    has_lower = re.search(r'[a-z]', password)
    has_digit = re.search(r'\d', password)
    
    return all([has_upper, has_lower, has_digit])

def validate_task_title(title: str) -> bool:
    """
    Validate task title.
    
    Args:
        title (str): Task title to validate
        
    Returns:
        bool: True if valid, False otherwise
    """
    return title is not None and title.strip() != ""