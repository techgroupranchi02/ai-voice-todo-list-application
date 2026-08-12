# AI Voice Todo List Application - Backend

This is the backend implementation for an AI Voice Todo List Application built with NestJS and PostgreSQL.

## Features Implemented

1. **User Authentication**
   - User registration with email validation
   - Password hashing using bcrypt
   - JWT-based authentication

2. **Task Management**
   - Manual task creation
   - Voice task creation (simulated)
   - Task CRUD operations

3. **Database Schema**
   - Users table with authentication details
   - Tasks table with relationships to users
   - Proper constraints and validations

4. **Security**
   - Input validation using class-validator
   - Error handling with custom filters
   - Helmet for security