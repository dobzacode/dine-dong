import asyncio

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    Header,
    HTTPException,
    Request,
    Security,
)
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
    payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
    try:
        if payment_intent.status != "succeeded":
            stripe.PaymentIntent.cancel(payment_intent_id)
        kv.delete(meal_id)
    except Exception as e:
        print(f"Error removing payment intent or KV entry: {e}")


@router.post("/payment-intent/", response_model=dict[str, str])
async def create_payment_intent(
    request: CreatePaymentIntentRequest,
    background_tasks: BackgroundTasks,
    auth: dict = Security(auth.verify),
):
    try:
        payment_intent = stripe.PaymentIntent.create(
            amount=request.amount * 100,
            currency=request.currency,
            description=request.description,
            metadata={"userSub": request.userSub, "mealId": request.mealId},
        )
        if request.isNewPaymentIntent:
            kv.set(request.mealId, request.userSub)
            background_tasks.add_task(
                remove_payment_intent_and_kv_entry, request.mealId, payment_intent.id
            )
        return {
            "status": "success",
            "clientSecret": payment_intent.client_secret,
            "id": payment_intent.id,
        }
    except Exception as e:
        print(e)
        raise HTTPException(status_code=403, detail=str(e))


@router.post("/webhooks")
async def webhook_received(
    request: Request,
    stripe_signature: str = Header(None),
    session: AsyncSession = Depends(deps.get_session),
):
    print(request)
    data = await request.body()
    try:
        event = stripe.Webhook.construct_event(
            payload=data, sig_header=stripe_signature, secret=webhook_secret
        )
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail=f"Webhook Error: {str(e)}")

    metadata = event["data"]["object"]["metadata"]

    kv.delete(metadata["mealId"])
    event_type = event["type"]

    meal = await session.scalar(select(Meal).where(Meal.meal_id == metadata["mealId"]))

    if meal is None:
        raise HTTPException(status_code=404, detail="Repas non trouvé")

    if event_type == "payment_intent.succeeded":
        new_order = Order(
            meal_id=metadata["mealId"], user_sub=metadata["userSub"], status="COMPLETED"
        )
        meal.is_ordered = True
        session.add(meal)
        session.add(new_order)
        await session.commit()
        await session.refresh(new_order)
        print(new_order.order_id)
        return {"status": "success", "order_id": new_order.order_id}
    else:
        print(f"unhandled event: {event_type}")

    return {"status": "success"}
