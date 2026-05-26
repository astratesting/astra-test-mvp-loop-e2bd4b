import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./habitpulse.db")
    secret_key: str = os.getenv("SECRET_KEY", "change-me-in-production")
    cors_origins: str = os.getenv("CORS_ORIGINS", "http://localhost:3000")


settings = Settings()
