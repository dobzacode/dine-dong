
from collections.abc import AsyncGenerator

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core import database_session
from app.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with database_session.get_async_session() as session:
        yield session

async def extract_sub_from_jwt(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, options={"verify_signature": False})
        return payload.get('sub')

    except Exception as e:
        print(f"Error extracting sub claim: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing token",
        )
        
async def get_current_user(
    sub: str = Depends(extract_sub_from_jwt),
    session: AsyncSession = Depends(get_session),
) -> User:

    user = await session.scalar(select(User).where(User.open_id == sub))

    if user is None:
        user = User(open_id=sub)
        session.add(user)
        await session.commit()
        await session.refresh(user)
    return user      
        
        
        
