# README.md
# AI Voice Todo List Application - Backend

This is the backend implementation for an AI Voice Todo List application built with FastAPI and PostgreSQL.

## Features Implemented

1. **User Authentication**
   - User registration with email validation
   - Password hashing and security
   - Duplicate email detection

2. **Task Management**
   - Manual task creation (POST /api/v1/tasks)
   - Voice task creation (POST /api/v1/tasks/voice)
   - Team-based task creation (POST /api/v1/teams/{team_id}/tasks)

3. **Database Schema**
   - Users table with authentication details
   - Tasks table with relationships to users and categories
   - Categories table for task classification

4. **API Endpoints**
   - Authentication endpoints
   - Task creation endpoints
   - Team task creation endpoints

## Technology Stack

- **Backend Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: Password hashing with bcrypt
- **Testing**: Pytest

## Installation

1. Clone the repository
2. Install dependencies: