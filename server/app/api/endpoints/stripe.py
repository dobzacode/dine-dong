import asyncio
import logging

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    Header,
    HTTPException,
    Request,
    Security,
)
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from stripe import stripe  # type: ignore

from app.api import deps
from app.core.config import get_settings
from app.core.kv import KV
from app.core.security.authenticate import VerifyToken
from app.models import Meal, Order
from app.schemas.requests import CreatePaymentIntentRequest

kv = KV()

router = APIRouter()
auth = VerifyToken()
stripe.api_key = get_settings().stripe_secret_key
base_url = get_settings().base_url
webhook_secret = get_settings().webhook_secret


async def remove_payment_intent_and_kv_entry(meal_id: str, payment_intent_id: str):
    await asyncio.sleep(180)
    logger: logging.Logger = deps.get_logger()

    try:
        payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        if payment_intent.status not in ["requires_capture", "succeeded"]:
            stripe.PaymentIntent.cancel(payment_intent_id)
            logger.info(f"Le pi {payment_intent.id} a été annulé avec succès")

        kv.delete(meal_id)
    except Exception as e:
        logger.error(
            f"Erreur lors de la suppression de l'intention de paiement ou de l'entrée KV: {e}"
        )
        print(
            f"Erreur lors de la suppression de l'intention de paiement ou de l'entrée KV: {e}"
        )


@router.post("/payment-intent/", response_model=dict[str, str])
async def create_payment_intent(
    request: CreatePaymentIntentRequest,
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(deps.get_session),
    logger: logging.Logger = Depends(deps.get_logger),
    auth: dict = Security(auth.verify),
):
    check_redis = kv.get(request.mealId)
    if check_redis is not None and check_redis != request.userSub:
        return JSONResponse(
            status_code=403, content={"message": "Une transaction est déjà en cours"}
        )

    try:
        query_order = (
            select(Order)
            .where(Order.meal_id == request.mealId)
            .where(Order.user_sub == request.userSub)
        )
        result = await session.execute(query_order)
        order = result.scalars().first()

        if order is not None and order.status in ("IN_PROGRESS", "FINALIZED"):
            return JSONResponse(
                status_code=403, content={"message": "Une commande est déjà en cours"}
            )

        query_meal = select(Meal).where(Meal.meal_id == request.mealId)
        result = await session.execute(query_meal)
        meal = result.scalars().first()

        if meal is None:
            return JSONResponse(
                status_code=404, content={"message": "Repas non trouvé"}
            )

        if meal.user_sub == request.userSub:
            return JSONResponse(
                status_code=403,
                content={
                    "message": "Le plat ne peut pas être acheté par la personne l'ayant produit"
                },
            )

        payment_intent = stripe.PaymentIntent.create(
            amount=request.amount * 100,
            currency=request.currency,
            description=request.description,
            payment_method_types=["card"],
            capture_method="manual",
            metadata={"userSub": request.userSub, "mealId": request.mealId},
        )

        if request.isNewPaymentIntent:
            kv.set(request.mealId, request.userSub)
            background_tasks.add_task(
                remove_payment_intent_and_kv_entry, request.mealId, payment_intent.id
            )

        logger.info(f"Payment intent {payment_intent.id} créé avec succès")
        return {
            "status": "success",
            "clientSecret": payment_intent.client_secret,
            "id": payment_intent.id,
        }

    except Exception as e:
        logger.error(
            f"Une erreur est survenue lors de la création de l'intent pour le repas {request.mealId}, erreur : {e}"
        )
        raise HTTPException(status_code=500, detail="Une erreur est survenue")


@router.post("/webhooks")
async def webhook_received(
    request: Request,
    stripe_signature: str = Header(None),
    session: AsyncSession = Depends(deps.get_session),
    logger: logging.Logger = Depends(deps.get_logger),
):
    try:
        data = await request.body()
        try:
            event = stripe.Webhook.construct_event(
                payload=data, sig_header=stripe_signature, secret=webhook_secret
            )
        except Exception as e:
            print(e)
            logger.error(
                f"Une erreur est survenue lors de la construction de l'event : {e}, {request}"
            )
            raise HTTPException(status_code=500, detail=f"Webhook Error: {str(e)}")

        metadata = event["data"]["object"]["metadata"]
        pi_id = event["data"]["object"]["id"]

        kv.delete(metadata["mealId"])
        event_type = event["type"]

        pi_status = event["data"]["object"]["status"]

        meal = await session.scalar(
            select(Meal).where(Meal.meal_id == metadata["mealId"])
        )

        if meal is None:
            raise HTTPException(status_code=404, detail="Repas non trouvé")

        if (
            event_type == "payment_intent.amount_capturable_updated"
            and pi_status == "requires_capture"
        ):
            new_order = Order(
                meal_id=metadata["mealId"],
                user_sub=metadata["userSub"],
                pi_id=pi_id,
                status="IN_PROGRESS",
            )
            meal.is_ordered = True
            session.add(meal)
            session.add(new_order)
            await session.commit()
            await session.refresh(new_order)
            logger.info(f"Commande {new_order.order_id} créé avec succès")

            return {"status": "success", "order_id": new_order.order_id}
        if event_type == "payment_intent.canceled":
            query = select(Order).where(Order.pi_id == pi_id)
            result = await session.execute(query)
            modified_order = result.scalars().first()

            if not modified_order:
                return JSONResponse(
                    status_code=404,
                    content={"message": f"Pas de commande trouvée pour le pi: {pi_id}"},
                )

            modified_order.status = "CANCELLED"

            session.add(meal)
            session.add(modified_order)

            await session.commit()
            await session.refresh(modified_order)
            logger.info(
                f"Commande {modified_order.order_id} annulé avec succès pour le pi: {pi_id}"
            )

            return {"status": "success"}
        if event_type == "payment_intent.succeeded":
            query = select(Order).where(Order.pi_id == pi_id)
            result = await session.execute(query)
            order = result.scalars().first()
            if not order:
                logger.error(
                    f"Une erreur est survenue lors de la récupération de la commande {pi_id}"
                )
                return JSONResponse(
                    status_code=404,
                    content={"message": f"Pas de commande trouvée pour le pi: {pi_id}"},
                )
            order.status = "FINALIZED"
            await session.commit()
            await session.refresh(order)
            logger.info(f"La commande {order.order_id} a été finalisée avec succès")

        print(f"unhandled event: {event_type}")
        return JSONResponse(
            status_code=403,
            content={"message": f"Evénement non géré : {event_type}"},
        )

        return {"status": "success"}
    except Exception as e:
        print(e)
        logger.error(
            f"Une erreur est survenue lors du traitement de l'event : {e}, {request}"
        )
        raise HTTPException(status_code=500, detail=f"Webhook Error: {str(e)}")
