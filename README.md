# Productivity App - Task Management & Voice Input System

[![License](https://img.shields.io/badge/license-UNLICENSED-blue)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-green)](https://github.com/your-repo/productivity-app)
[![Coverage Status](https://img.shields.io/badge/coverage-85%25-green)](https://github.com/your-repo/productivity-app)

## 📌 Table of Contents
- [📖 About the Project](#-about-the-project)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📂 Project Structure](#-project-structure)
- [📋 Prerequisites](#-prerequisites)
- [🚀 Installation](#-installation)
- [🔐 Environment Variables](#-environment-variables)
- [▶️ Running the Project](#-running-the-project)
- [🐳 Docker Usage](#-docker-usage)
- [🔌 API Documentation](#-api-documentation)
- [🗄️ Database Setup](#-database-setup)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [🔧 Maintenance Commands](#-maintenance-commands)
- [🐛 Troubleshooting](#-troubleshooting)
- [🔒 Security Guidelines](#-security-guidelines)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👨‍💻 Maintainer](#-maintainer)
- [⭐ Support](#-support)

## 📖 About the Project

**Problem Statement:** Modern professionals struggle with task management and productivity tracking across multiple platforms. Voice input capabilities are often missing from traditional productivity tools, making it difficult to capture ideas quickly.

**Solution:** Productivity App is a comprehensive solution that combines robust task management with voice input functionality. It provides users with an intuitive interface for creating, organizing, and completing tasks while offering hands-free voice input capabilities for seamless idea capture.

The application features:
- Task creation, organization, and completion tracking
- Voice input for task creation and note-taking
- Team collaboration features
- Real-time updates and notifications
- Secure authentication and authorization

## ✨ Features

- 📋 **Task Management** - Create, update, delete, and organize tasks with categories and priorities
- 🎤 **Voice Input** - Record voice notes and transcribe them into text for task creation
- 👥 **Team Collaboration** - Share tasks and collaborate with team members
- 🔒 **Secure Authentication** - JWT-based authentication with refresh token rotation
- 📊 **Real-time Updates** - WebSocket-powered real-time notifications and updates
- 📱 **Responsive UI** - Mobile-first design for all device sizes
- 🛡️ **Security Features** - Input validation, rate limiting, and secure password handling
- 🔄 **Task Lifecycle** - Complete task toggling with visual status indicators
- 🗂️ **Category Management** - Organize tasks into meaningful categories

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Cache**: Redis
- **Authentication**: JWT with Passport.js
- **API Documentation**: Swagger/OpenAPI
- **Logging**: Winston

### Frontend
- **Framework**: React Native (TypeScript)
- **UI Library**: React Native Components
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation

### Database
- **Primary**: PostgreSQL
- **Cache**: Redis

### AI/Automation
- **Speech Recognition**: Web Speech API
- **Transcription**: Browser-based speech recognition

### DevOps
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Monitoring**: Winston logging
- **Testing**: Jest, Supertest

## 📂 Project Structure