# src/services/user_service.py
from sqlalchemy.orm import Session
from models.user import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_user_by_email(self, email: str) -> User:
        return self.db.query(User).filter(User.email == email).first()
    
    def create_user(self, first_name: str, last_name: str, email: str, password: str) -> User:
        hashed_password = pwd_context.hash(password)
        user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=hashed_password
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)