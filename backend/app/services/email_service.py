import logging
import smtplib
from email.message import EmailMessage

from app.core.config import get_settings

logger = logging.getLogger(__name__)


def send_email(to: str, subject: str, body: str) -> None:
    settings = get_settings()

    if not settings.smtp_host:
        logger.info("SMTP non configuré — email simulé : to=%s subject=%s body=%s", to, subject, body)
        return

    message = EmailMessage()
    message["From"] = settings.smtp_from_email
    message["To"] = to
    message["Subject"] = subject
    message.set_content(body)

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
        server.starttls()
        if settings.smtp_user and settings.smtp_password:
            server.login(settings.smtp_user, settings.smtp_password)
        server.send_message(message)
