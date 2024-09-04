from fastapi import APIRouter, Depends, HTTPException, Query, Security
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.security.authenticate import VerifyToken
from app.models import Address, User
from app.schemas.requests import CreateUserRequest
from app.schemas.responses import UserResponse

router = APIRouter()
auth = VerifyToken()


@router.get(
    "",
    description="Obtenir les informations de l'utilisateur par ID",
    response_model=UserResponse,
)
async def read_current_user(
    session: AsyncSession = Depends(deps.get_session),
    id: str = Query(None, description="ID de l'utilisateur à récupérer"),
    sub: str = Query(None, description="Sub de l'utilisateur à récupérer"),
):
    if not id and not sub:
        raise HTTPException(status_code=422, detail="ID ou sub est requis")

    try:
        user_query = (
            select(User)
            .where(or_(User.user_id == id, User.open_id == sub))
            .join(Address, User.residency)
        )
        result = await session.scalar(user_query)
        user = result

        if not user:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

        return user
    except Exception as e:
        print(e, "Error")
        raise HTTPException(
            status_code=500,
            detail="Une erreur est survenue lors de la récupération des détails de l'utilisateur",
        )


@router.get(
    "/get-auth0-information",
    description="Obtenir les informations de l'utilisateur par ID",
    response_model=dict[str, str],
)
async def get_auth0_information(
    token: dict[str, str] = Depends(deps.extract_sub_email_from_jwt),
    user: dict = Security(auth.verify),
):
    return {"email": token.get("email")}


@router.get(
    "/is-user-registered",
    description="Vérifier si l'utilisateur est enregistré",
    response_model=bool,
)
async def is_user_registered(
    token: dict[str, str] = Depends(deps.extract_sub_email_from_jwt),
    session: AsyncSession = Depends(deps.get_session),
    user: dict = Security(auth.verify),
):
    user = await session.scalar(select(User).where(User.open_id == token.get("sub")))

    if not user:
        return False

    return True


@router.get(
    "/check-username-availability",
    description="Vérifier si le nom d'utilisateur est disponible",
    response_model=bool,
)
async def check_username_availability(
    session: AsyncSession = Depends(deps.get_session),
    username: str = Query(None, description="Nom d'utilisateur à vérifier"),
):
    if not username:
        raise HTTPException(status_code=422, detail="Le nom d'utilisateur est requis")

    try:
        user_query = select(User).where(User.username == username)
        result = await session.scalar(user_query)
        return result is None
    except Exception as e:
        print(e, "Error")
        raise HTTPException(
            status_code=500,
            detail="Une erreur est survenue lors de la récupération des détails de l'utilisateur",
        )


@router.get(
    "/check-email-availability",
    description="Vérifier si l'email est disponible",
    response_model=bool,
)
async def check_email_availability(
    session: AsyncSession = Depends(deps.get_session),
    email: str = Query(None, description="Email à vérifier"),
):
    if not email:
        raise HTTPException(status_code=422, detail="L'email est requis")

    try:
        user_query = select(User).where(User.email == email)
        result = await session.scalar(user_query)
        return result is None
    except Exception as e:
        print(e, "Error")
        raise HTTPException(
            status_code=500,
            detail="Une erreur est survenue lors de la récupération des détails de l'utilisateur",
        )


@router.post(
    "",
    description="Créer un nouveau utilisateur",
    response_model=UserResponse,
    status_code=201,
)
async def create_user(
    user_data: CreateUserRequest,
    session: AsyncSession = Depends(deps.get_session),
):
    try:
        new_user = User(
            open_id=user_data.sub,
            username=user_data.username,
            email=user_data.email,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            phone_number=user_data.phone_number,
            picture_url=user_data.picture_url,
        )

        new_address = Address(
            address1=user_data.address.address1,
            address2=user_data.address.address2,
            formatted_address=user_data.address.formatted_address,
            city=user_data.address.city,
            department=user_data.address.department,
            postal_code=user_data.address.postal_code,
            country=user_data.address.country,
            lat=user_data.address.lat,
            lng=user_data.address.lng,
            user=new_user,
        )

        new_user.residency = new_address
        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)
        return new_user
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail="Une erreur est survenue lors de la création de l'utilisateur",
        )
