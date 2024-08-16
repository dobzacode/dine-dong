from fastapi import APIRouter, Depends, Security
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.security.authenticate import VerifyToken
from app.models import User
from app.schemas.responses import UserResponse

router = APIRouter()
auth = VerifyToken()

@router.get("/me",  description="Get current user", response_model=UserResponse)
def read_current_user(current_user: User = Depends(deps.get_current_user),
    session: AsyncSession = Depends(deps.get_session), user: dict = Security(auth.verify)) -> User:
    return current_user










