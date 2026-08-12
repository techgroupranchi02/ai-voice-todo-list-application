# tests/test_auth.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from main import app
from database.db import get_db
from models.user import User
from unittest.mock import patch, MagicMock

client = TestClient(app)

def test_register_user_valid():
    """Test successful user registration"""
    response = client.post("/api/v1/auth/register", json={
        "email": "test@example.com",
        "password": "SecurePass123",
        "firstName": "John",
        "lastName": "Doe"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "userId" in data["data"]
    assert data["data"]["message"] == "User registered successfully."

def test_register_user_invalid_email():
    """Test user registration with invalid email"""
    response = client.post("/api/v1/auth/register", json={
        "email": "invalid-email",
        "password": "SecurePass123",
        "firstName": "John",
        "lastName": "Doe"
    })
    
    assert response.status_code == 400
    data = response.json()
    assert data["detail"] == "The provided email address is invalid."

def test_register_user_duplicate_email():
    """Test user registration with existing email"""
    # Mock database to return existing user
    with patch('database.db.get_db') as mock_get_db:
        mock_db = MagicMock()
        mock_db.query.return_value.filter.return_value.first.return_value = User(
            id=1,
            first_name="John",
            last_name="Doe",
            email="test@example.com",
            password="hashed_password"
        )
        mock_get_db.return_value = mock_db
        
        response = client.post("/api/v1/auth/register", json={
            "email": "test@example.com",
            "password": "SecurePass123",
            "firstName": "John",
            "lastName": "Doe"
        })
        
        assert response.status_code == 409
        data = response.json()
        assert data["detail"] == "An account with this email already exists."