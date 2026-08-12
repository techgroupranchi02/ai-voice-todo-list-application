# src/utils/helpers.py
from datetime import datetime
from typing import Optional

def format_datetime(dt: Optional[datetime]) -> Optional[str]:
    """
    Format datetime object to ISO string.
    
    Args:
        dt (datetime): Datetime object to format
        
    Returns:
        str: Formatted datetime string or None if input is None
    """
    if dt is None:
        return None
    return dt.isoformat()

def validate_due_date(due_date: Optional[datetime]) -> bool:
    """
    Validate that due date is in the future.
    
    Args:
        due_date (datetime): Due date to validate
        
    Returns:
        bool: True if valid, False otherwise
    """
    if due_date is None:
        return True  # No due date is valid
    
    return due_date > datetime.now()