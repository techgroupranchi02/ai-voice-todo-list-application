# src/config/settings.py
import os

class Settings:
    # Database settings
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/todo_db")
    
    # Security settings
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    
    # Audio processing settings
    AUDIO_PROCESSING_TIMEOUT = 30

settings = Settings()