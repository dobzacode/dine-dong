from collections.abc import AsyncGenerator

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import database_session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with database_session.get_async_session() as session:
        yield session


async def extract_sub_email_from_jwt(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, options={"verify_signature": False})

        return {"sub": payload.get("sub"), "email": payload.get("email")}

    except Exception as e:
        print(f"Error extracting sub claim: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing token",
        )
