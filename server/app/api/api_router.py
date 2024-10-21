from fastapi import APIRouter

from app.api import api_messages
from app.api.endpoints import chats, meals, orders, stripe, users

api_router = APIRouter(
    responses={
        401: {
            "description": "No `Authorization` access token header, token is invalid or user removed",
            "content": {
                "application/json": {
                    "examples": {
                        "not authenticated": {
                            "summary": "No authorization token header",
                            "value": {"detail": "Not authenticated"},
                        },
                        "invalid token": {
                            "summary": "Token validation failed, decode failed, it may be expired or malformed",
                            "value": {"detail": "Token invalid: {detailed error msg}"},
                        },
                        "removed user": {
                            "summary": api_messages.JWT_ERROR_USER_REMOVED,
                            "value": {"detail": api_messages.JWT_ERROR_USER_REMOVED},
                        },
                    }
                }
            },
        },
    },
)

api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(meals.router, prefix="/meals", tags=["meals"])
api_router.include_router(stripe.router, prefix="/stripe", tags=["stripe"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(chats.router, prefix="/chats", tags=["chats"])
