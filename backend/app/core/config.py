import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Student Collaboration & Networking Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    ENV: str = "development"

    SECRET_KEY: str = "dev-secret-key-change-this-in-production-super-secret-key-12345"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    DATABASE_URL: str = "sqlite:///./student_platform.db"
    FRONTEND_URL: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def cors_origins(self) -> List[str]:
        origins = [self.FRONTEND_URL, "http://localhost:5173", "http://127.0.0.1:5173"]
        return list(set(origins))

settings = Settings()
