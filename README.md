# Voice Assistant App

> A smart voice assistant application with speech recognition, task management, and real-time communication capabilities.

## 📌 Table of Contents

- [📖 About the Project](#-about-the-project)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📂 Project Structure](#-project-structure)
- [📋 Prerequisites & Version Check](#-prerequisites--version-check)
- [🚀 Installation Steps](#-installation-steps)
- [🔐 Environment Variables](#-environment-variables)
- [▶️ Running the Project](#️-running-the-project)
- [🐳 Running with Docker](#-running-with-docker)
- [🔌 API Documentation](#-api-documentation)
- [🗄️ Database Setup & Migration](#-database-setup--migration)
- [🧪 Testing & Build Commands](#-testing--build-commands)
- [🚀 Deployment Guide](#-deployment-guide)
- [🔧 Useful Maintenance Commands](#-useful-maintenance-commands)
- [🐛 Troubleshooting](#-troubleshooting)
- [🔒 Security Guidelines](#-security-guidelines)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👨‍💻 Maintainer Info](#-maintainer-info)
- [⭐ Support](#-support)

## 📖 About the Project

### Problem Statement
Modern productivity tools often lack seamless voice interaction capabilities, making it difficult for users to efficiently manage tasks and communicate in real-time while maintaining focus on their work.

### Solution
This Voice Assistant App provides a comprehensive solution that combines:
- Real-time speech recognition and transcription
- Task management with interactive status controls
- WebSocket-based real-time communication
- Secure authentication and authorization
- Scalable backend architecture with NestJS

## ✨ Features

- 🎤 **Voice Recognition & Transcription**: Real-time speech-to-text conversion using Web Speech API
- 📋 **Task Management**: Create, update, complete tasks with interactive UI controls
- 🔗 **Real-Time Communication**: WebSocket integration for live updates and notifications
- 🔐 **Secure Authentication**: JWT-based authentication with refresh token rotation
- 📊 **Task Status Tracking**: Visual indicators for task completion status with filtering
- 🌐 **Responsive UI**: Mobile-first design compatible with all device sizes
- 🛡️ **Security**: Helmet.js protection, rate limiting, input validation
- 📈 **Monitoring**: Winston logging and performance monitoring

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Cache**: Redis
- **Authentication**: JWT, Passport.js
- **Real-time**: WebSocket, Socket.IO
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React Native (TypeScript)
- **UI Library**: React Native components
- **State Management**: React hooks and context API
- **Networking**: Axios for HTTP requests

### Database
- **Primary**: PostgreSQL
- **Cache**: Redis

### AI/Automation
- **Speech Recognition**: Web Speech API
- **Natural Language Processing**: Ollama integration (planned)

### DevOps
- **Containerization**: Docker
- **CI/CD**: GitHub Actions (planned)
- **Monitoring**: Winston logging, PM2 process manager

## 📂 Project Structure
