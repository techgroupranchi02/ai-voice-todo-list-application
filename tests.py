# tests.py
import unittest
import os
import sys
from app import app, db
from models import User, Task
from werkzeug.security import generate_password_hash

class APITestCase(unittest.TestCase):
    def setUp(self):
        """Set up test client and database"""
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()
        
        # Create tables
        db.create_all()
        
        # Create a test user
        self.test_user = User(
            first_name='Test',
            last_name='User',
            email='test@example.com',
            password=generate_password_hash('password123')
        )
        db.session.add(self.test_user)
        db.session.commit()

    def tearDown(self):
        """Clean up after tests"""
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_register_user_success(self):
        """Test successful user registration"""
        response = self.app.post('/api/v1/auth/register',
                                json={
                                    'email': 'newuser@example.com',
                                    'password': 'securePassword',
                                    'firstName': 'New',
                                    'lastName': 'User'
                                })
        
        self.assertEqual(response.status_code, 201)
        data = response.get_json()
        self.assertTrue(data['success'])
        self.assertIn('userId', data['data'])

    def test_register_user_invalid_email(self):
        """Test user registration with invalid email"""
        response = self.app.post('/api/v1/auth/register',
                                json={
                                    'email': 'invalid-email',
                                    'password': 'securePassword',
                                    'firstName': 'New',
                                    'lastName': 'User'
                                })
        
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertFalse(data['success'])
        self.assertIn('invalid', data['error'].lower())

    def test_register_user_existing_email(self):
        """Test user registration with existing email"""
        response = self.app.post('/api/v1/auth/register',
                                json={
                                    'email': 'test@example.com',
                                    'password': 'securePassword',
                                    'firstName': 'New',
                                    'lastName': 'User'
                                })
        
        self.assertEqual(response.status_code, 409)
        data = response.get_json()
        self.assertFalse(data['success'])
        self.assertIn('already exists', data['error'].lower())

    def test_login_user_success(self):
        """Test successful user login"""
        response = self.app.post('/api/v1/auth/login',
                                json={
                                    'email': 'test@example.com',
                                    'password': 'password123'
                                })
        
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data['success'])
        self.assertIn('accessToken', data['data'])

    def test_login_user_invalid_credentials(self):
        """Test user login with invalid credentials"""
        response = self.app.post('/api/v1/auth/login',
                                json={
                                    'email': 'test@example.com',
                                    'password': 'wrongpassword'
                                })
        
        self.assertEqual(response.status_code, 401)
        data = response.get_json()
        self.assertFalse(data['success'])
        self.assertIn('invalid', data['error'].lower())

    def test_create_task_success(self):
        """Test successful task creation"""
        # First login to get access token
        login_response = self.app.post('/api/v1/auth/login',
                                      json={
                                          'email': 'test@example.com',
                                          'password': 'password123'
                                      })
        
        access_token = login_response.get_json()['data']['accessToken']
        
        response = self.app.post('/api/v1/tasks',
                                headers={'Authorization': f'Bearer {access_token}'},
                                json={
                                    'title': 'Test Task',
                                    'description': 'This is a test task',
                                    'priority': 'High'
                                })
        
        self.assertEqual(response.status_code, 201)
        data = response.get_json()
        self.assertTrue(data['success'])
        self.assertIn('taskId', data['data'])

    def test_create_task_missing_title(self):
        """Test task creation with missing title"""
        # First login to get access token
        login_response = self.app.post('/api/v1/auth/login',
                                      json={
                                          'email': 'test@example.com',
                                          'password': 'password123'
                                      })
        
        access_token = login_response.get_json()['data']['accessToken']
        
        response = self.app.post('/api/v1/tasks',
                                headers={'Authorization': f'Bearer {access_token}'},
                                json={
                                    'description': 'This is a test task'
                                })
        
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertFalse(data['success'])
        self.assertIn('title cannot be empty', data['error'].lower())

    def test_create_task_from_voice_success(self):
        """Test successful voice task creation"""
        # First login to get access token
        login_response = self.app.post('/api/v1/auth/login',
                                      json={
                                          'email': 'test@example.com',
                                          'password': 'password123'
                                      })
        
        access_token = login_response.get_json()['data']['accessToken']
        
        response = self.app.post('/api/v1/tasks/voice',
                                headers={'Authorization': f'Bearer {access_token}'},
                                json={
                                    'audioData': 'base64encodedaudiostring'
                                })
        
        self.assertEqual(response.status_code, 201)
        data = response.get_json()
        self.assertTrue(data['success'])
        self.assertIn('taskId', data['data'])

    def test_create_team_task_success(self):
        """Test successful team task creation"""
        # First login to get access token
        login_response = self.app.post('/api/v1/auth/login',
                                      json={
                                          'email': 'test@example.com',
                                          'password': 'password123'
                                      })
        
        access_token = login_response.get_json()['data']['accessToken']
        
        response = self.app.post('/api/v1/teams/1/tasks',
                                headers={'Authorization': f'Bearer {access_token}'},
                                json={
                                    'title': 'Team Task',
                                    'description': 'This is a team task',
                                    'priority': 'Medium'
                                })
        
        self.assertEqual(response.status_code, 201)
        data = response.get_json()
        self.assertTrue(data['success'])
        self.assertIn('taskId', data['data'])

if __name__ == '__main__':
    unittest.main()