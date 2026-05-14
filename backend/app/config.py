from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:822849@localhost:5432/epi_saas"
    SECRET_KEY: str = "troque-por-uma-chave-secreta-longa-e-aleatoria"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480  # 8 horas

    class Config:
        env_file = ".env"

settings = Settings()