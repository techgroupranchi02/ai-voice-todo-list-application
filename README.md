# Jira Task Recreator

> AI-powered tool for recreating Jira tasks with enhanced task descriptions and requirements

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
The Jira Task Recreator is an AI-powered solution that helps software development teams efficiently recreate and enhance Jira tasks. By leveraging advanced language models, it transforms basic task descriptions into comprehensive requirements with clear acceptance criteria, estimated effort, and related dependencies.

This tool addresses common challenges in task management where developers often struggle with incomplete or ambiguous task descriptions, leading to rework and delays. The system automatically analyzes existing tasks and generates enhanced versions that include all necessary details for successful implementation.

## ✨ Features
- 🤖 **AI-Powered Task Enhancement** - Automatically enriches task descriptions with detailed requirements and acceptance criteria
- 🔍 **Smart Task Analysis** - Analyzes existing Jira tasks to identify missing information and gaps
- 📊 **Effort Estimation** - Provides estimated effort calculations for tasks using AI models
- 🔄 **Task Recreation** - Recreates tasks with improved clarity and completeness
- 📁 **Multi-Format Support** - Handles various task formats including plain text, markdown, and structured data
- 🔐 **Secure Authentication** - Implements JWT-based authentication with refresh token rotation
- 📈 **Real-time Collaboration** - Supports real-time updates and collaboration features
- 🛡️ **Comprehensive Security** - Includes security middleware for protection against common threats

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: JWT with refresh tokens
- **AI Integration**: Ollama API for language model processing

### Frontend
- **Framework**: React Native (TypeScript)
- **UI Library**: React Native components
- **State Management**: React hooks and context API

### Database
- **Primary**: PostgreSQL
- **Cache**: Redis

### AI/Automation
- **Language Models**: Ollama API
- **Task Processing**: AI-powered task enhancement algorithms

### DevOps
- **Containerization**: Docker
- **Build Tools**: Nest CLI, TypeScript compiler
- **Testing**: Jest, Supertest
- **Code Quality**: ESLint, Prettier, Husky

## 📂 Project Structure