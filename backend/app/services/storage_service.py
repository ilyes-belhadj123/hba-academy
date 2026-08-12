import io
import uuid
from abc import ABC, abstractmethod
from pathlib import Path

from PIL import Image

from app.core.config import get_settings

MAX_IMAGE_DIMENSION = 1600
IMAGE_QUALITY = 80


def _unique_filename(original_filename: str) -> str:
    suffix = Path(original_filename).suffix.lower()
    return f"{uuid.uuid4().hex}{suffix}"


def compress_image_if_needed(content: bytes, content_type: str) -> bytes:
    if not content_type.startswith("image/"):
        return content

    with Image.open(io.BytesIO(content)) as image:
        image = image.convert("RGB") if image.mode in ("P", "RGBA") else image
        image.thumbnail((MAX_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION))
        buffer = io.BytesIO()
        image.save(buffer, format="JPEG", quality=IMAGE_QUALITY, optimize=True)
        return buffer.getvalue()


class StorageBackend(ABC):
    @abstractmethod
    async def save(self, content: bytes, filename: str, content_type: str) -> str:
        """Sauvegarde le fichier et retourne son URL publique."""


class LocalStorageBackend(StorageBackend):
    def __init__(self) -> None:
        settings = get_settings()
        self._uploads_dir = Path(settings.uploads_dir)
        self._uploads_dir.mkdir(parents=True, exist_ok=True)
        self._public_base_url = settings.public_base_url.rstrip("/")

    async def save(self, content: bytes, filename: str, content_type: str) -> str:
        stored_name = _unique_filename(filename)
        (self._uploads_dir / stored_name).write_bytes(content)
        return f"{self._public_base_url}/uploads/{stored_name}"


class AzureBlobStorageBackend(StorageBackend):
    def __init__(self) -> None:
        settings = get_settings()
        if not settings.azure_storage_connection_string:
            raise RuntimeError(
                "AZURE_STORAGE_CONNECTION_STRING est requis pour utiliser le backend azure_blob"
            )

        from azure.storage.blob import BlobServiceClient

        self._container_name = settings.azure_storage_container
        self._client = BlobServiceClient.from_connection_string(settings.azure_storage_connection_string)
        self._client.get_container_client(self._container_name).create_container(exist_ok=True)

    async def save(self, content: bytes, filename: str, content_type: str) -> str:
        from azure.storage.blob import ContentSettings

        stored_name = _unique_filename(filename)
        blob_client = self._client.get_blob_client(container=self._container_name, blob=stored_name)
        blob_client.upload_blob(
            content, overwrite=True, content_settings=ContentSettings(content_type=content_type)
        )
        return blob_client.url


def get_storage() -> StorageBackend:
    settings = get_settings()
    if settings.storage_backend == "azure_blob":
        return AzureBlobStorageBackend()
    return LocalStorageBackend()
