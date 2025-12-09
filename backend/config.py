import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

class Config:
    """Flask app configuration class."""

    # Basic setup
    SECRET_KEY = os.environ.get("SECRET_KEY", "supersecretkey")
    DEBUG = os.environ.get("DEBUG", "True").lower() == "true"

    # Database
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_NAME = os.getenv('DB_NAME', 'home_furniture_db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = (
        f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
    )
    
    # JWT authentication
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwtsecretkey")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        hours=int(os.environ.get("JWT_EXPIRES_HOURS", 2))
    )
    JWT_IDENTITY_CLAIM = "user_id"

    # CORS
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*")
 