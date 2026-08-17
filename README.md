# Task Management App

> A comprehensive task management application with voice input capabilities and real-time collaboration features.

## 📌 Table of Contents

- [📖 About the Project](#-about-the-project)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📂 Project Structure](#-project-structure)
- [📋 Prerequisites & Version Check](#-prerequisites--version-check)
- [🚀 Installation Steps](#-installation-steps)
- [🔐 Environment Variables](#-environment-variables)
- [▶️ Running the Project](#-running-the-project)
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
Modern productivity tools often lack seamless integration between task management, voice input capabilities, and real-time collaboration features. Users struggle with fragmented workflows when managing tasks across multiple platforms.

### Solution
This Task Management App provides a unified platform that combines traditional task management with advanced voice recognition, real-time updates, and collaborative features - all within a single, cohesive application.

## ✨ Features

- 📋 **Task Management**: Create, update, delete, and organize tasks with status tracking
- 🎤 **Voice Input**: Record and transcribe audio directly into tasks using Web Speech API
- 🔗 **Real-time Collaboration**: Live task updates through WebSocket connections
- 👥 **User Authentication**: Secure login with JWT and refresh token rotation
- 📊 **Task Analytics**: Performance metrics and productivity insights
- 🌐 **Responsive UI**: Mobile-first design for all device sizes
- 🛡️ **Security**: Role-based access control and secure authentication
- 🔄 **Automated Workflows**: Scheduled task reminders and notifications

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Cache**: Redis
- **Authentication**: JWT, Passport.js
- **Real-time**: WebSocket, Socket.IO
- **Logging**: Winston

### Frontend
- **Framework**: React Native (TypeScript)
- **UI Library**: React Native components
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation

### Database
- **Primary**: PostgreSQL
- **Cache**: Redis

### AI/Automation
- **Speech Recognition**: Web Speech API
- **Voice Processing**: Base64 audio encoding/decoding

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions (planned)
- **Monitoring**: Winston logging

## 📂 Project Structure
