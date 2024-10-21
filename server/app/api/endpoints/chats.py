import logging

from fastapi import APIRouter, Depends, HTTPException, Path, Security
from sqlalchemy import or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api import deps
from app.core.security.authenticate import VerifyToken
from app.models import Chat, Meal, Message, Order, User
from app.schemas.requests import CreateMessageRequest
from app.schemas.responses import CreateMessageResponse, ExtendedChatResponse

router = APIRouter()
auth = VerifyToken()


@router.get("/{user_sub}", response_model=list[ExtendedChatResponse])
async def get_chats_id(
    user_sub: str = Path(..., description="ID de l'utilisateur à récupérer"),
    session: AsyncSession = Depends(deps.get_session),
    logger: logging.Logger = Depends(deps.get_logger),
    auth: dict = Security(auth.verify),
    token: dict[str, str] = Depends(deps.extract_sub_email_from_jwt),
):
    print(user_sub)

    if not user_sub:
        raise HTTPException(status_code=422, detail="L'utilisateur est requis")

    if token["sub"] != user_sub:
        raise HTTPException(
            status_code=403,
            detail="Vous n'êtes pas autorisé au message de cet utilisateur",
        )

    try:
        query = (
            select(Chat)
            .where(or_(Chat.user1_sub == user_sub, Chat.user2_sub == user_sub))
            .order_by(Chat.update_time.desc())
        )
        result = await session.execute(query)
        chats = result.scalars().all()

        print(chats[0].update_time)

        if not chats:
            raise HTTPException(status_code=404, detail="Aucun chat trouvé")

        extended_chats = []
        for chat in chats:
            other_user_sub = (
                chat.user1_sub if chat.user1_sub != user_sub else chat.user2_sub
            )
            user_result = await session.execute(
                select(User).where(User.user_sub == other_user_sub)
            )
            other_user = user_result.scalar_one_or_none()

            if not other_user:
                raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

            last_message_query = (
                select(Message)
                .where(Message.chat_id == chat.chat_id)
                .order_by(Message.update_time.desc())
            )
            last_message_result = await session.execute(last_message_query)
            last_message = last_message_result.scalar_one_or_none()

            order_result = await session.execute(
                select(Order).where(Order.order_id == chat.order_id)
            )
            order = order_result.scalar_one_or_none()

            if not order:
                raise HTTPException(status_code=404, detail="Commande non trouvée")

            meal_result = await session.execute(
                select(Meal).where(Meal.meal_id == order.meal_id)
            )
            meal = meal_result.scalar_one_or_none()

            if not meal:
                raise HTTPException(status_code=404, detail="Repas non trouvé")

            extended_chats.append(
                ExtendedChatResponse(
                    update_time=chat.update_time,
                    create_time=chat.create_time,
                    chat_id=chat.chat_id,
                    user1_sub=chat.user1_sub,
                    user2_sub=chat.user2_sub,
                    other_user_image=other_user.picture_key,
                    other_user_name=other_user.username,
                    last_message_content=last_message.content if last_message else None,
                    meal_image=meal.picture_key,
                    meal_name=meal.name,
                )
            )

        return extended_chats
    except Exception as e:
        print(e)
        logger.error(
            f"Une erreur est survenue lors de la récupération des chats pour l'utilisateur {user_sub}",
            exc_info=e,
        )
        raise HTTPException(
            status_code=500,
            detail="Une erreur est survenue lors de la récupération des chats pour l'utilisateur",
        )


@router.get("/{user_sub}/last", response_model=str)
async def get_last_chat_id(
    user_sub: str = Path(..., description="ID de l'utilisateur à récupérer"),
    session: AsyncSession = Depends(deps.get_session),
    logger: logging.Logger = Depends(deps.get_logger),
    auth: dict = Security(auth.verify),
    token: dict[str, str] = Depends(deps.extract_sub_email_from_jwt),
):
    if not user_sub:
        raise HTTPException(status_code=422, detail="L'utilisateur est requis")

    if token["sub"] != user_sub:
        raise HTTPException(
            status_code=403,
            detail="Vous n'êtes pas autorisé au message de cet utilisateur",
        )

    try:
        query = (
            select(Chat)
            .where(or_(Chat.user1_sub == user_sub, Chat.user2_sub == user_sub))
            .order_by(Chat.update_time.desc())
        )
        result = await session.execute(query)
        chat = result.scalars().first()

        if not chat:
            raise HTTPException(status_code=404, detail="Aucun chat trouvé")

        return chat.chat_id

    except Exception as e:
        print(e)
        logger.error(
            f"Une erreur est survenue lors de la récupération du dernier chat pour l'utilisateur {user_sub}",
            exc_info=e,
        )
        raise HTTPException(
            status_code=500,
            detail="Une erreur est survenue lors de la récupération du dernier chat pour l'utilisateur",
        )


@router.get("/{chat_id}/snippet", response_model=dict)
async def get_chat_snippet(
    chat_id: str = Path(..., description="ID de la conversation à récupérer"),
    session: AsyncSession = Depends(deps.get_session),
    token: dict[str, str] = Depends(deps.extract_sub_email_from_jwt),
    logger: logging.Logger = Depends(deps.get_logger),
    auth: dict = Security(auth.verify),
):
    try:
        result = await session.execute(select(Chat).where(Chat.chat_id == chat_id))
        chat = result.scalars().first()

        if not chat:
            raise HTTPException(status_code=404, detail="Chat non trouvé")

        current_user = token["sub"]
        other_user_sub = (
            chat.user1_sub if chat.user1_sub != current_user else chat.user2_sub
        )

        user_result = await session.execute(
            select(User).where(User.user_sub == other_user_sub)
        )
        other_user = user_result.scalar_one_or_none()

        if not other_user:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

        order_result = await session.execute(
            select(Order).where(Order.order_id == chat.order_id)
        )
        order = order_result.scalar_one_or_none()

        if not order:
            raise HTTPException(status_code=404, detail="Commande non trouvée")

        meal_result = await session.execute(
            select(Meal).where(Meal.meal_id == order.meal_id)
        )
        meal = meal_result.scalar_one_or_none()

        if not meal:
            raise HTTPException(status_code=404, detail="Repas non trouvé")

        return {
            "meal_name": meal.name,
            "other_user_name": other_user.username,
        }

    except Exception as e:
        print(e)
        logger.error(
            f"Une erreur est survenue lors de la récupération du snippet de chat {chat_id}",
            exc_info=e,
        )
        raise HTTPException(
            status_code=500,
            detail="Une erreur est survenue lors de la récupération du snippet de chat",
        )


@router.post("/{chat_id}/messages", response_model=CreateMessageResponse)
async def create_message(
    message_in: CreateMessageRequest,
    chat_id: str = Path(..., description="ID de la conversation à récupérer"),
    session: AsyncSession = Depends(deps.get_session),
    token: dict[str, str] = Depends(deps.extract_sub_email_from_jwt),
    logger: logging.Logger = Depends(deps.get_logger),
    auth: dict = Security(auth.verify),
):
    try:
        result = await session.execute(select(Chat).where(Chat.chat_id == chat_id))
        chat = result.scalars().first()

        if not chat:
            raise HTTPException(status_code=404, detail="Chat non trouvée")

        current_user = token["sub"]
        if current_user not in {chat.user1_sub, chat.user2_sub}:
            raise HTTPException(
                status_code=403, detail="Vous n'êtes pas autorisé à accéder à ce chat"
            )

        new_message = Message(
            content=message_in.content,
            chat_id=chat_id,
            sender_sub=current_user,
            receiver_sub=message_in.receiver_sub,
        )
        session.add(new_message)
        await session.commit()
        await session.refresh(new_message)
        logger.info(f"Un message a été créé dans le chat {chat_id}")
        return {"message_id": new_message.message_id}
    except Exception as e:
        print(e)
        logger.error(
            f"Une erreur est survenue lors de la création d'un message dans le chat {chat_id}",
            e,
        )
        raise HTTPException(
            status_code=500,
            detail="Une erreur est survenue lors de la création d'un message dans le chat",
        )
