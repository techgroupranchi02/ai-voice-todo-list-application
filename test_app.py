# test_app.py
import pytest
from app import app, db, User, Task
from flask import json
import os

@pytest.fixture
def client():
    # Create a test database
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['JWT_SECRET_KEY'] = 'test-secret-key'
    
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client

def test_register_user_success(client):
    """Test successful user registration"""
    response = client.post('/api/v1/auth/register', 
                          data=json.dumps({
                              "email": "test@example.com",
                              "password": "TestPass123",
                              "firstName": "John",
                              "lastName": "Doe"
                          }),
                          content_type='application/json')
    
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['success'] is True
    assert 'userId' in data['data']

def test_register_user_invalid_email(client):
    """Test user registration with invalid email"""
    response = client.post('/api/v1/auth/register', 
                          data=json.dumps({
                              "email": "invalid-email",
                              "password": "TestPass123",
                              "firstName": "John"
                          }),
                          content_type='application/json')
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert data['success'] is False
    assert data['error']['code'] == 'INVALID_EMAIL'

def test_register_user_existing_email(client):
    """Test user registration with existing email"""
    # First registration
    client.post('/api/v1/auth/register', 
                data=json.dumps({
                    "email": "test@example.com",
                    "password": "TestPass123",
                    "firstName": "John"
                }),
                content_type='application/json')
    
    # Second registration with same email
    response = client.post('/api/v1/auth/register', 
                          data=json.dumps({
                              "email": "test@example.com",
                              "password": "TestPass123",
                              "firstName": "Jane"
                          }),
                          content_type='application/json')
    
    assert response.status_code == 409
    data = json.loads(response.data)
    assert data['success'] is False
    assert data['error']['code'] == 'EMAIL_EXISTS'

def test_register_user_invalid_password(client):
    """Test user registration with invalid password"""
    response = client.post('/api/v1/auth/register', 
                          data=json.dumps({
                              "email": "test@example.com",
                              "password": "weak",
                              "firstName": "John"
                          }),
                          content_type='application/json')
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert data['success'] is False
    assert data['error']['code'] == 'INVALID_PASSWORD'

def test_create_task_success(client):
    """Test successful task creation"""
    # Register a user first
    client.post('/api/v1/auth/register', 
                data=json.dumps({
                    "email": "test@example.com",
                    "password": "TestPass123",
                    "firstName": "John"
                }),
                content_type='application/json')
    
    # Login to get token (in real app, you'd have a login endpoint)
    # For testing purposes, we'll directly use the user ID
    
    response = client.post('/api/v1/tasks', 
                          data=json.dumps({
                              "title": "Grocery Shopping",
                              "description": "Buy milk, eggs, and bread.",
                              "dueDate": "2024-03-15",
                              "priority": 3,
                              "category": "Personal"
                          }),
                          content_type='application/json')
    
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['success'] is True
    assert 'taskId' in data['data']

def test_create_task_invalid_input(client):
    """Test task creation with invalid input"""
    response = client.post('/api/v1/tasks', 
                          data=json.dumps({
                              "description": "This task has no title"
                          }),
                          content_type='application/json')
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert data['success'] is False
    assert data['error']['code'] == 'INVALID_INPUT'

def test_create_task_from_voice_success(client):
    """Test successful voice task creation"""
    # Register a user first
    client.post('/api/v1/auth/register', 
                data=json.dumps({
                    "email": "test@example.com",
                    "password": "TestPass123",
                    "firstName": "John"
                }),
                content_type='application/json')
    
    response = client.post('/api/v1/tasks/voice', 
                          data=json.dumps({
                              "audioData": "base64encodedaudio"
                          }),
                          content_type='application/json')
    
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['success'] is True
    assert 'taskId' in data['data']

def test_create_team_task_success(client):
    """Test successful team task creation"""
    # Register a user first
    client.post('/api/v1/auth/register', 
                data=json.dumps({
                    "email": "test@example.com",
                    "password": "TestPass123",
                    "firstName": "John"
                }),
                content_type='application/json')
    
    response = client.post('/api/v1/teams/1/tasks', 
                          data=json.dumps({
                              "title": "Team Meeting Prep",
                              "description": "Prepare agenda and materials for the upcoming team meeting.",
                              "dueDate": "2024-03-18",
                              "priority": 2
                          }),
                          content_type='application/json')
    
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['success'] is True
    assert 'taskId' in data['data']

def test_create_team_task_invalid_input(client):
    """Test team task creation with invalid input"""
    response = client.post('/api/v1/teams/1/tasks', 
                          data=json.dumps({
                              "description": "This task has no title"
                          }),
                          content_type='application/json')
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert data['success'] is False
    assert data['error']['code'] == 'INVALID_INPUT'

def test_not_found_handler(client):
    """Test 404 error handling"""
    response = client.get('/non-existent-endpoint')
    
    assert response.status_code == 404
    data = json.loads(response.data)
    assert data['success'] is False
    assert data['error']['code'] == 'NOT_FOUND'

def test_internal_error_handler(client):
    """Test 500 error handling"""
    # This would normally be triggered by an internal error
    # We'll simulate it by directly calling the handler
    with app.test_request_context():
        from app import internal_error
        response = internal_error(Exception("Test error"))
        assert response.status_code == 500
        data = json.loads(response.data)
        assert data['success'] is False
        assert data['error']['code'] == 'INTERNAL_ERROR'