from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    environment: str = "development"
    log_level: str = "INFO"

    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "hba_connect"

    cors_allowed_origins: str = "http://localhost:5173"

    jwt_secret_key: str = "change-me"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 30
    jwt_refresh_token_expire_days: int = 7

    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_user: str | None = None
    smtp_password: str | None = None
    smtp_from_email: str = "no-reply@hba-academy.example"

    storage_backend: str = "local"
    uploads_dir: str = "uploads"
    public_base_url: str = "http://localhost:8000"
    azure_storage_connection_string: str | None = None
    azure_storage_container: str = "hba-connect-media"

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_allowed_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
