import os
import sys
import unittest
from app import app, db
from models import User, Task, Category

# Add the project root to Python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

class APITestCase(unittest.TestCase):
    def setUp(self):
        """Set up test client and database"""
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        db.create_all()
        
        # Create a test category
        self.category = Category(name="Personal")
        db.session.add(self.category)
        db.session.commit()

    def tearDown(self):
        """Clean up database after each test"""
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def register_user(self):
        """Helper method to register a user"""
        return self.app.post('/api/v1/auth/register', 
                            json={
                                'email': 'test@example.com',
                                'password': 'password123',
                                'firstName': 'Test',
                                'lastName': 'User'
                            })

    def login_user(self):
        """Helper method to login a user and get token"""
        response = self.app.post('/api/v1/auth/login', 
                                json={
                                    'email': 'test@example.com',
                                    'password': 'password123'
                                })
        return response.get_json()

    def test_register_user_success(self):
        """Test successful user registration"""
        response = self.register_user()
        data = response.get_json()
        
        self.assertEqual(response.status_code, 201)
        self.assertTrue(data['success'])
        self.assertIn('userId', data['data'])

    def test_register_user_invalid_email(self):
        """Test user registration with invalid email"""
        response = self.app.post('/api/v1/auth/register', 
                                json={
                                    'email': 'invalid-email',
                                    'password': 'password123',
                                    'firstName': 'Test',
                                    'lastName': 'User'
                                })
        
        data = response.get_json()
        self.assertEqual(response.status_code, 400)
        self.assertFalse(data['success'])
        self.assertIn('invalid email address', data['error']['message'])

    def test_register_user_duplicate_email(self):
        """Test user registration with existing email"""
        # Register first user
        self.register_user()
        
        # Try to register with same email
        response = self.register_user()
        data = response.get_json()
        
        self.assertEqual(response.status_code, 409)
        self.assertFalse(data['success'])
        self.assertIn('already exists', data['error']['message'])

    def test_login_user_success(self):
        """Test successful user login"""
        # Register a user first
        self.register_user()
        
        # Login
        response = self.login_user()
        data = response.get_json()
        
        self.assertEqual(response.status_code, 200)
        self.assertTrue(data['success'])
        self.assertIn('accessToken', data['data'])

    def test_login_user_invalid_credentials(self):
        """Test user login with invalid credentials"""
        # Try to login without registering
        response = self.app.post('/api/v1/auth/login', 
                                json={
                                    'email': 'test@example.com',
                                    'password': 'wrongpassword'
                                })
        
        data = response.get_json()
        self.assertEqual(response.status_code, 401)
        self.assertFalse(data['success'])
        self.assertIn('Invalid email or password', data['error']['message'])

    def test_create_task_success(self):
        """Test successful task creation"""
        # Register and login
        self.register_user()
        auth_data = self.login_user()
        token = auth_data['data']['accessToken']
        
        # Create task
        response = self.app.post('/api/v1/tasks',
                                headers={'Authorization': f'Bearer {token}'},
                                json={
                                    'title': 'Test Task',
                                    'description': 'This is a test task',
                                    'dueDate': '2024-12-31',
                                    'priority': 1,
                                    'category_id': self.category.id
                                })
        
        data = response.get_json()
        self.assertEqual(response.status_code, 201)
        self.assertTrue(data['success'])
        self.assertIn('taskId', data['data'])

    def test_create_task_missing_title(self):
        """Test task creation with missing title"""
        # Register and login
        self.register_user()
        auth_data = self.login_user()
        token = auth_data['data']['accessToken']
        
        # Create task without title
        response = self.app.post('/api/v1/tasks',
                                headers={'Authorization': f'Bearer {token}'},
                                json={
                                    'description': 'This is a test task'
                                })
        
        data = response.get_json()
        self.assertEqual(response.status_code, 400)
        self.assertFalse(data['success'])
        self.assertIn('Title cannot be empty', data['error']['message'])

    def test_create_task_from_voice_success(self):
        """Test successful voice task creation"""
        # Register and login
        self.register_user()
        auth_data = self.login_user()
        token = auth_data['data']['accessToken']
        
        # Create task from voice
        response = self.app.post('/api/v1/tasks/voice',
                                headers={'Authorization': f'Bearer {token}'},
                                json={
                                    'audioData': 'base64encodedaudiostring'
                                })
        
        data = response.get_json()
        self.assertEqual(response.status_code, 201)
        self.assertTrue(data['success'])
        self.assertIn('taskId', data['data'])

    def test_create_team_task_success(self):
        """Test successful team task creation"""
        # Register and login
        self.register_user()
        auth_data = self.login_user()
        token = auth_data['data']['accessToken']
        
        # Create team task
        response = self.app.post('/api/v1/teams/1/tasks',
                                headers={'Authorization': f'Bearer {token}'},
                                json={
                                    'title': 'Team Task',
                                    'description': 'This is a team task',
                                    'dueDate': '2024-12-31',
                                    'priority': 1,
                                    'category_id': self.category.id
                                })
        
        data = response.get_json()
        self.assertEqual(response.status_code, 201)
        self.assertTrue(data['success'])
        self.assertIn('taskId', data['data'])

    def test_unauthorized_access(self):
        """Test access to protected routes without authentication"""
        response = self.app.post('/api/v1/tasks',
                                json={
                                    'title': 'Test Task'
                                })
        
        self.assertEqual(response.status_code, 401)

if __name__ == '__main__':
    unittest.main()