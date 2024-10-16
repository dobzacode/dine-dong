import logging
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Path, Query, Security
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.security.authenticate import VerifyToken
from app.models import Meal, Order
from app.schemas.responses import (
    ModifyOrderStatusResponse,
    OrderDetailResponse,
    OrderSummary,
)

router = APIRouter()
auth = VerifyToken()


@router.get(
    "/summaries",
    response_model=list[OrderSummary],
    description="Obtenir tous les ID des commandes et leurs états",
)
async def get_order_summaries(
    session: AsyncSession = Depends(deps.get_session),
    id: str = Query(None, description="ID de la commande à récupérer"),
    logger: logging.Logger = Depends(deps.get_logger),
):
    try:
        query = select(Order.order_id, Order.status)

        if id:
            query = query.where(Order.order_id == id)

        result = await session.execute(query)
        order_summaries = result.all()

    except Exception as e:
        print(e)
        logger.error(
            f"Une erreur est survenue lors de la récupération des résumés des commandes {id}",
            e,
        )
        raise HTTPException(
            status_code=500,
            detail="Une erreur est survenue lors de la récupération des résumés des commandes",
        )

    if not order_summaries:
        raise HTTPException(status_code=404, detail="Aucunes commandes trouvées")
    orders = [
        {"order_id": order_id, "status": order_status}
        for order_id, order_status in order_summaries
    ]
    return orders


@router.get(
    "/{order_id}",
    response_model=OrderDetailResponse,
    description="Obtenir les détails d'une commande",
)
async def get_order(
    session: AsyncSession = Depends(deps.get_session),
    order_id: str = Path(..., description="ID de la commande à récupérer"),
    logger: logging.Logger = Depends(deps.get_logger),
    token: dict[str, str] = Depends(deps.extract_sub_email_from_jwt),
    auth: dict = Security(auth.verify),
):
    try:
        query = select(Order).join(Meal).where(Order.order_id == order_id)
        result = await session.execute(query)
        order = result.scalars().first()

        if not order:
            return JSONResponse(
                status_code=404, content={"message": "Commande non trouvée"}
            )

        if token.get("sub") not in [order.user_sub, order.meal.user_sub]:
            return JSONResponse(
                status_code=401,
                content={
                    "message": "Vous n'êtes pas autorisé à consulter cette commande"
                },
            )

        return order

    except Exception as e:
        print(e, "Error")
        logger.error(
            f"Une erreur est survenue lors de la récupération de la commande {order_id}",
            e,
        )
        raise HTTPException(
            status_code=500,
            detail="Une erreur est survenue lors de la récupération de la commande",
        )


@router.put(
    "/{order_id}/status",
    description="Modifie l'état d'une commande",
    response_model=ModifyOrderStatusResponse,
    status_code=200,
)
async def modify_order_status(
    session: AsyncSession = Depends(deps.get_session),
    order_id: str = Path(..., description="ID de la commande à modifier"),
    new_status: Literal["FINALIZED", "CANCELLED", "IN_PROGRESS"] = Query(
        None, description="Nouvel état de la commande"
    ),
    token: dict[str, str] = Depends(deps.extract_sub_email_from_jwt),
    logger: logging.Logger = Depends(deps.get_logger),
    auth: dict = Security(auth.verify),
):
    if not order_id:
        raise HTTPException(status_code=422, detail="ID de la commande est requis")

    if not new_status:
        raise HTTPException(
            status_code=422, detail="Le nouvel état de la commande est requis"
        )

    try:
        query = (
            select(Order, Meal.user_sub).join(Meal).where(Order.order_id == order_id)
        )
        result = await session.execute(query)
        order = result.scalars().first()

        if not order:
            return JSONResponse(
                status_code=404, content={"message": "Commande non trouvée"}
            )

        if token.get("sub") not in [order.user_sub, order.meal.user_sub]:
            return JSONResponse(
                status_code=401,
                content={
                    "message": "Vous n'êtes pas autorisé à modifier cette commande"
                },
            )

        order.status = new_status
        await session.commit()
        await session.refresh(order)

        logger.info(f"La commande {order_id} a été modifiée avec succès")

        order_dict = {
            key: value
            for key, value in order.__dict__.items()
            if not key.startswith("_")
        }
        return {**order_dict, "owner_sub": order.meal.user_sub}

    except Exception as e:
        print(e, "Error")
        logger.error(
            f"Une erreur est survenue lors de la modification de la commande {order_id}",
            e,
        )
        raise HTTPException(
            status_code=500,
            detail="Une erreur est survenue lors de la modification de la commande",
        )
