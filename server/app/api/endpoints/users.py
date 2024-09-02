from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.security.authenticate import VerifyToken
from app.models import User
from app.schemas.responses import UserResponse

router = APIRouter()
auth = VerifyToken()


@router.get("/", description="Get user information by ID", response_model=UserResponse)
async def read_current_user(
    session: AsyncSession = Depends(deps.get_session),
    id: str = Query(None, description="ID of the meal to retrieve"),
):
    if not id:
        raise HTTPException(status_code=422, detail="ID is required")

    try:
        user_query = select(User).where(User.user_id == id)
        result = await session.scalar(user_query)
        user = result

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return user
    except Exception as e:
        print(e, "Error")
        raise HTTPException(
            status_code=500, detail="An error occurred while retrieving user details"
        )
