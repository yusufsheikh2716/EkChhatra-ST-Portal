from routers.auth import router as auth_router
from routers.scholarships import router as scholarships_router
from routers.applications import router as applications_router
from routers.documents import router as documents_router
from routers.notifications import router as notifications_router
from routers.chat import router as chat_router
from routers.verification import router as verification_router
from routers.analytics import router as analytics_router

__all__ = [
    "auth_router",
    "scholarships_router",
    "applications_router",
    "documents_router",
    "notifications_router",
    "chat_router",
    "verification_router",
    "analytics_router"
]
