from fastapi import APIRouter, Depends, HTTPException, Path, Query, Security
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.security.authenticate import VerifyToken
from app.models import Address, Meal, User
from app.schemas.requests import CreateUserRequest, ModifyUserRequest
from app.schemas.responses import MealResponse, UserResponse
from app.utils.utils import update_user_address, update_user_data

router = APIRouter()
auth = VerifyToken()


@router.get(
    "",
    description="Obtenir les informations de l'utilisateur par ID",
    response_model=UserResponse,
)
async def get_user_informations(
    session: AsyncSession = Depends(deps.get_session),
    sub: str = Query(None, description="Sub de l'utilisateur à récupérer"),
    username: str = Query(None, description="Pseudo de l'utilisateur à récupérer"),
):
    if not sub and not username:
        raise HTTPException(status_code=422, detail="sub ou username requis")

    try:
        user_query = (
            select(User)
            .join(Address, User.residency)
            .where(or_(User.username == username, User.user_sub == sub))
        )
        user = await session.scalar(user_query)

    except Exception as e:
        print(e, "Error")
        raise HTTPException(
            status_code=500,
            detail="Une erreur est survenue lors de la récupération des détails de l'utilisateur",
        )

    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    return user


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
    user = await session.scalar(select(User).where(User.user_sub == token.get("sub")))

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


@router.get("/get-user-params", response_model=list[str])
async def get_user_params(
    session: AsyncSession = Depends(deps.get_session),
):
    try:
        user_query = select(User.username)
        result = await session.execute(user_query)
        usernames = result.scalars().all()

        return usernames
    except Exception as e:
        print(e, "Error")
        raise HTTPException(
            status_code=500,
            detail="Une erreur est survenue lors de la récupération des pseudos des utilisateurs",
        )


@router.get(
    "/{sub}/meals",
    response_model=list[MealResponse],
    description="Obtenir tous les repas de l'utilisateur",
    status_code=200,
)
async def get_user_meals(
    sub: str = Path(
        ..., description="ID de l'utilisateur dont les repas seront récupérés"
    ),
    session: AsyncSession = Depends(deps.get_session),
):
    if not sub:
        raise HTTPException(status_code=422, detail="ID de l'utilisateur est requis")
    try:
        result = await session.execute(select(Meal).where(Meal.user_sub == sub))
        meals = result.all()
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail="Une erreur est survenue lors de la récupération des repas de l'utilisateur",
        )
    if not meals:
        raise HTTPException(status_code=404, detail="Aucun repas trouvé")
    return meals[0]


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
            user_sub=user_data.sub,
            username=user_data.username,
            email=user_data.email,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            phone_number=user_data.phone_number,
            picture_key=user_data.picture_key,
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


@router.put(
    "",
    description="Modifie un utilisateur",
    response_model=str,
    status_code=200,
)
async def modify_user(
    user_data: ModifyUserRequest,
    session: AsyncSession = Depends(deps.get_session),
    token: dict[str, str] = Depends(deps.extract_sub_email_from_jwt),
    auth: dict = Security(auth.verify),
):
    if not user_data.user_sub:
        raise HTTPException(status_code=422, detail="ID de l'utilisateur est requis")

    user = await session.scalar(select(User).where(User.user_sub == user_data.user_sub))

    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    if user.user_sub != token.get("sub"):
        raise HTTPException(
            status_code=401,
            detail="Vous n'êtes pas autorisé à modifier cet utilisateur",
        )

    try:
        update_user_data(user, user_data)

        update_user_address(user, user_data)

        await session.commit()
        await session.refresh(user)
        return user.username
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail="Une erreur est survenue lors de la modification du profil de l'utilisateur",
        )
