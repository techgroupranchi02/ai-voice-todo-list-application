# Voice Task Manager

> Transform your productivity with voice-enabled task management powered by AI transcription and real-time collaboration.

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
Voice Task Manager is a revolutionary productivity application that combines voice recognition technology with task management to create an intuitive, hands-free workflow. Users can record voice commands to create, update, and complete tasks, while AI-powered transcription converts speech to text for better organization and searchability.

The platform features real-time collaboration, smart task categorization, and seamless integration with existing productivity tools. Whether you're a busy professional, student, or anyone looking to boost their productivity, Voice Task Manager transforms how you manage your daily tasks through the power of voice.

## ✨ Features
- 🎤 **Voice-Enabled Task Management**: Create, update, and complete tasks using natural speech commands
- 🔊 **Real-time Transcription**: AI-powered speech-to-text conversion with live transcription feedback
- 📝 **Smart Task Organization**: Automatic categorization and tagging of tasks based on voice content
- 🔄 **Real-time Collaboration**: Share tasks and updates with team members in real-time
- 📊 **Productivity Analytics**: Insights into task completion patterns and time management
- 🔐 **Secure Authentication**: JWT-based authentication with refresh token rotation
- 📱 **Cross-platform Support**: Mobile-first responsive design for all devices
- ⚡ **Fast Performance**: Optimized backend with Redis caching and PostgreSQL database
- 🌐 **RESTful API**: Comprehensive API for third-party integrations

## 🛠️ Tech Stack
### Backend
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: JWT with refresh tokens
- **API Documentation**: Swagger/OpenAPI
- **Security**: Helmet.js, rate limiting

### Frontend
- **Framework**: React Native (TypeScript)
- **UI Library**: React Native components
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **API Client**: Axios

### Database
- **Primary**: PostgreSQL with TypeORM
- **Cache**: Redis for session and caching

### AI/Automation
- **Speech Recognition**: Web Speech API + Whisper (OpenAI)
- **Transcription**: Ollama integration for local AI processing
- **Natural Language Processing**: AI-powered task categorization

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Winston logging
- **Testing**: Jest, Supertest

## 📂 Project Structure