# tests/test_tasks.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from main import app
from database.db import get_db
from models.task import Task
from unittest.mock import patch, MagicMock

client = TestClient(app)

def test_create_task_valid():
    """Test successful task creation"""
    response = client.post("/api/v1/tasks/", json={
        "title": "Grocery Shopping",
        "description": "Buy milk, eggs, and bread.",
        "dueDate": "2024-03-15T00:00:00",
        "priority": 3,
        "category": "Personal"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "taskId" in data["data"]
    assert data["data"]["message"] == "Task created successfully."

def test_create_task_empty_title():
    """Test task creation with empty title"""
    response = client.post("/api/v1/tasks/", json={
        "title": "",
        "description": "Buy milk, eggs, and bread.",
        "dueDate": "2024-03-15T00:00:00",
        "priority": 3,
        "category": "Personal"
    })
    
    assert response.status_code == 400
    data = response.json()
    assert data["detail"] == "Title cannot be empty."

def test_create_task_from_voice():
    """Test creating task from voice input"""
    response = client.post("/api/v1/tasks/voice", json={
        "audioData": "base64encodedaudio"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "taskId" in data["data"]
    assert data["data"]["message"] == "Task created from voice input successfully."

def test_create_team_task():
    """Test creating task within a team"""
    response = client.post("/api/v1/teams/team1/tasks", json={
        "title": "Team Meeting Prep",
        "description": "Prepare agenda and materials for the upcoming team meeting.",
        "dueDate": "2024-03-18T00:00:00",
        "priority": 2,
        "assigneeId": "user_id_of_team_member"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "taskId" in data["data"]
    assert data["data"]["message"] == "Task created successfully."