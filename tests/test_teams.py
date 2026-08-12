import pytest
from app import app, db
from models import User

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            # Create a test user
            user = User(
                first_name="John",
                last_name="Doe",
                email="test@example.com"
            )
            user.set_password("SecurePass123")
            db.session.add(user)
            db.session.commit()
            yield client

def test_create_team_task_valid(client):
    """Test successful team task creation"""
    response = client.post('/api/v1/teams/1/tasks', 
                          json={
                              "title": "Team Meeting Prep",
                              "description": "Prepare agenda and materials for the upcoming team meeting.",
                              "dueDate": "2024-03-18T10:00:00Z",
                              "priority": 2
                          })
    
    assert response.status_code == 201
    data = response.get_json()
    assert data['success'] is True
    assert 'taskId' in data['data']

def test_create_team_task_missing_title(client):
    """Test team task creation with missing title"""
    response = client.post('/api/v1/teams/1/tasks', 
                          json={
                              "description": "Prepare agenda and materials for the upcoming team meeting."
                              # Missing title
                          })
    
    assert response.status_code == 400
    data = response.get_json()
    assert 'Title is required.' in data['error']