# VoiceTaskManager

> A voice-enabled task management application with AI transcription capabilities

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
VoiceTaskManager is a modern task management application that leverages voice recognition and AI transcription to create tasks through natural speech. Users can speak their tasks, which are automatically transcribed and converted into actionable items in the system. The application features real-time updates, task completion tracking, and seamless integration with AI-powered transcription services.

## ✨ Features
- 🎤 **Voice Task Creation** - Create tasks using voice commands with real-time transcription
- 🧠 **AI Transcription** - Automatic speech-to-text conversion using Ollama AI
- 📋 **Task Management** - Complete task lifecycle with status tracking and updates
- 🔁 **Real-time Updates** - WebSocket-powered live task synchronization
- 🔐 **Secure Authentication** - JWT-based authentication with refresh token rotation
- 📊 **Task Analytics** - Progress tracking and productivity insights
- 🌐 **Cross-platform Support** - Mobile-first responsive design with React Native
- 🛡️ **Security Features** - Rate limiting, input validation, and secure token handling

## 🛠️ Tech Stack
### Backend
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: JWT with Passport.js
- **AI Integration**: Ollama API for transcription
- **Real-time**: WebSocket/Socket.IO

### Frontend
- **Framework**: React Native (TypeScript)
- **UI Library**: React Native Elements
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **Audio Handling**: React Native Voice

### Database
- **Primary DB**: PostgreSQL with TypeORM
- **Cache**: Redis for session and rate limiting

### AI/Automation
- **Transcription**: Ollama (Llama3 model)
- **NLP**: Natural language processing for task extraction

### DevOps
- **Build Tool**: Nest CLI, Webpack
- **Testing**: Jest, Supertest
- **Linting**: ESLint, Prettier
- **Version Control**: Git with Husky hooks
- **Deployment**: Docker, PM2 (optional)

## 📂 Project Structure