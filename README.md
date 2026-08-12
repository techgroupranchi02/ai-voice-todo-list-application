# AI Voice Todo List Application

> An AI-powered multi-lingual productivity platform that converts natural speech into organized tasks, translates multiple languages, and manages daily schedules seamlessly.

---

## 📌 Table of Contents

* [About the Project](#-about-the-project)
* [Features](#-features)
* [Tech Stack](#-tech-stack)
* [Project Structure](#-project-structure)
* [Prerequisites](#-prerequisites)
* [Installation](#-installation)
* [Environment Variables](#-environment-variables)
* [Running the Project](#-running-the-project)
* [Running with Docker](#-running-with-docker)
* [API Documentation](#-api-documentation)
* [Database](#-database)
* [Testing](#-testing)
* [Deployment](#-deployment)
* [Troubleshooting](#-troubleshooting)
* [Security](#-security)
* [Contributing](#-contributing)
* [License](#-license)
* [Contact](#-contact)

---

## 📖 About the Project

**AI Voice Todo List Application** is a modern productivity tool designed to eliminate manual task typing by leveraging speech-to-text recognition, multi-lingual AI translation, and automated task categorization.

### Problem Statement

Traditional productivity applications rely heavily on manual typing, which is slow and inconvenient on the go. Existing voice assistants often lack contextual intelligence, misinterpret task details, and lack multi-language support or smart schedule organization.

### Solution

This platform provides hands-free task creation using advanced AI speech recognition (Whisper / Speech-to-Text), multi-language translation, automatic deadline & priority parsing, and real-time synchronization across devices.

---

## ✨ Features

* 🔐 **User Authentication & Authorization**: Secure JWT-based authentication, password hashing with bcrypt, and user registration validation.
* 🎙️ **AI Voice Entry**: Speech-to-text processing for hands-free task creation with intent & entity extraction (title, description, due date, priority).
* 📝 **Manual Task Management**: Full CRUD operations for tasks, subtasks, categories, and due dates.
* 🌐 **Multi-Language Support**: AI translation for task titles and descriptions.
* 📊 **Dashboard & Productivity Analytics**: Track completed vs pending tasks, daily statistics, and completion rates.
* 📅 **Calendar & Schedule View**: Visualize tasks in daily, weekly, and monthly calendar views.
* ⚡ **Real-Time Synchronisation**: Live task status updates and WebSocket event notifications.
* 🛡️ **Enterprise Security**: Helmet security headers, input sanitization (`class-validator`), rate-limiting, and error handling filters.

---

## 🛠️ Tech Stack

### Backend
* **Runtime / Framework**: NestJS (TypeScript) & Python FastAPI
* **Database**: PostgreSQL (TypeORM / SQLAlchemy)
* **Caching & Queues**: Redis
* **Authentication**: Passport-JWT, bcrypt

### Frontend
* **Framework**: React 18, Vite, TypeScript
* **UI Components**: Tailwind CSS / Material UI
* **State Management**: Zustand / React Query

### AI & Automation
* **Speech-to-Text**: Whisper API / Web Speech API
* **NLU / AI Models**: Ollama (`qwen3-coder:30b` / `gemma3:27b`)
* **Framework**: LangChain / Custom Multi-Agent Pipeline

### DevOps & Infrastructure
* **Containerization**: Docker, Docker Compose
* **API Documentation**: OpenAPI / Swagger (`/api/docs`)
* **CI/CD**: GitHub Actions
* **Version Control**: Git / GitHub

---

## 📂 Project Structure

```text
ai-voice-todo-list-application/
├── src/
│   ├── api/
│   │   ├── auth.py
│   │   ├── tasks.py
│   │   └── teams.py
│   ├── models/
│   │   ├── user.py
│   │   ├── task.py
│   │   └── category.py
│   ├── services/
│   │   ├── user_service.py
│   │   ├── task_service.py
│   │   └── voice_service.py
│   ├── database/
│   │   └── db.py
│   ├── config/
│   │   └── settings.py
│   ├── utils/
│   │   ├── validators.py
│   │   └── helpers.py
│   └── main.py
├── tests/
│   ├── test_auth.py
│   ├── test_tasks.py
│   └── test_voice.py
├── docker/
│   └── Dockerfile
├── .env.example
├── .gitignore
├── docker-compose.yml
├── nest-cli.json
├── package.json
├── requirements.txt
└── README.md
```

---

## 📋 Prerequisites

Before running the project, make sure the following are installed:

* **Node.js** (`v18+` or `v20+`) & **npm** (`v9+`)
* **Python** (`3.10+` or `3.11+`)
* **PostgreSQL** (`v14+`)
* **Redis** (`v6+`)
* **Docker & Docker Compose** (Optional, for containerized execution)

Check installed versions:
```bash
node --version
python --version
pip --version
psql --version
redis-cli --version
docker --version
```

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/techgroupranchi02/ai-voice-todo-list-application.git
cd ai-voice-todo-list-application
```

### 2. Backend Setup

Install Python dependencies:
```bash
pip install -r requirements.txt
```

Or for NestJS / Node environment:
```bash
npm install
```

### 3. Environment Setup

Copy the environment configuration template:
```bash
cp .env.example .env
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following configuration:

```env
# Application
APP_NAME=AIVoiceTodoList
APP_ENV=development
PORT=8000
HOST=0.0.0.0

# Database (PostgreSQL)
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=voice_todo_db
DB_USER=postgres
DB_PASSWORD=your_password

# Cache & Message Broker
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Security & JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRATION=86400s

# AI & Voice Processing
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen3-coder:30b
```

> ⚠️ **Important**: Never commit your actual `.env` file to Git repository. Always use `.env.example` for sharing required configuration.

---

## ▶️ Running the Project

### Start NestJS Backend Service

```bash
# Start in Development Mode (with hot-reload)
npm run start:dev

# Build for Production
npm run build

# Start Production Server
npm run start:prod
```

Backend API server will be accessible at:
```text
http://localhost:3000
```

---

## 🐳 Running with Docker

### Build and Start Containers

```bash
docker-compose up -d --build
```

### Check Container Status

```bash
docker ps
```

### View Live Logs

```bash
docker-compose logs -f
```

### Stop Containers

```bash
docker-compose down
```

---

## 🔌 API Documentation

### Base URL

```text
http://localhost:8000/api
```

### Authentication Header

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### Core API Endpoints

#### 1. User Registration
```http
POST /api/auth/register
```
**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "first_name": "Sarah",
  "last_name": "Student"
}
```
**Response:**
```json
{
  "success": true,
  "user_id": "usr_99812",
  "message": "User registered successfully"
}
```

#### 2. User Login
```http
POST /api/auth/login
```
**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```
**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "token_type": "Bearer",
  "expires_in": 86400
}
```

#### 3. Create Task via Voice Input
```http
POST /api/voice/process
```
**Request (Multipart/Form-Data):**
* `audio_file`: Audio blob (`.wav`, `.mp3`, `.m4a`)
* `language`: `"en"` or `"auto"`

**Response:**
```json
{
  "transcription": "Schedule doctor appointment for next Tuesday at 10 AM",
  "extracted_task": {
    "title": "Doctor Appointment",
    "description": "Schedule doctor appointment",
    "due_date": "2026-08-18T10:00:00Z",
    "priority": "High",
    "category": "Health"
  },
  "ai_confidence": 0.96
}
```

---

## 🗄️ Database

### Database Engine
**PostgreSQL** relational database.

### Setup & Migrations

Run database migrations:
```bash
# TypeORM / NestJS
npm run migration:run

# Python / Alembic
alembic upgrade head
```

---

## 🧪 Testing

Run unit tests:
```bash
pytest tests/
```

Or for NestJS:
```bash
npm run test
```

Generate test coverage:
```bash
pytest --cov=src tests/
```

---

## 🚀 Deployment

### Production Build

1. Install production dependencies:
```bash
pip install -r requirements.txt --no-cache-dir
```

2. Configure production flags in `.env`:
```env
APP_ENV=production
DEBUG=False
```

3. Deploy using Docker Compose:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 🔧 Useful Commands

### Maintenance Commands
```bash
# Clear Python bytecode cache
find . -type d -name "__pycache__" -exec rm -rf {} +

# Re-run migrations
alembic upgrade head
```

### Docker Maintenance
```bash
docker-compose ps
docker-compose restart backend
```

---

## 🐛 Troubleshooting

### Issue 1: Database Connection Failed
* Verify PostgreSQL is active: `sudo systemctl status postgresql`
* Ensure `.env` database parameters match your local PostgreSQL service.

### Issue 2: Audio Processing Timeout
* Verify Ollama / Voice service is running at `OLLAMA_BASE_URL`.
* Ensure audio files are in supported formats (WAV, MP3, M4A).

---

## 🔒 Security

* All credentials & secrets stored strictly in `.env`.
* Password hashing using `bcrypt` / `argon2`.
* Strict request body validation via `class-validator` / `pydantic`.
* Helmet security headers & HTTPS encryption enabled.

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: Add new feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request.

---

## 📄 License

Licensed under the **MIT License**. See `LICENSE` for details.

---

## 👨‍💻 Maintainer

**techgroupranchi02**
* GitHub: [techgroupranchi02](https://github.com/techgroupranchi02)
* Email: techgroupranchi02@gmail.com

---

## ⭐ Support

If you find this project useful, please consider giving it a ⭐ on [GitHub](https://github.com/techgroupranchi02/ai-voice-todo-list-application)!