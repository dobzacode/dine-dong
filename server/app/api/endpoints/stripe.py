from fastapi import APIRouter, Depends, Header, HTTPException, Request, Security
from sqlalchemy.ext.asyncio import AsyncSession
from stripe import stripe  # type: ignore

from app.api import deps
from app.core.config import get_settings
from app.core.kv import KV
from app.core.security.authenticate import VerifyToken
from app.models import Order
from app.schemas.requests import CreatePaymentIntentRequest

kv = KV()

router = APIRouter()
auth = VerifyToken()
stripe.api_key = get_settings().stripe_secret_key
base_url = get_settings().base_url
webhook_secret = get_settings().webhook_secret


@router.post("/payment-intent/", response_model=dict[str, str])
async def create_payment_intent(
    request: CreatePaymentIntentRequest, auth: dict = Security(auth.verify)
):
    try:
        payment_intent = stripe.PaymentIntent.create(
            amount=request.amount * 100,
            currency=request.currency,
            description=request.description,
            metadata={"userId": request.userId, "mealId": request.mealId},
        )
        if request.isNewPaymentIntent:
            kv.set(request.mealId, request.userId)
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
    data = await request.body()
    try:
        event = stripe.Webhook.construct_event(
            payload=data, sig_header=stripe_signature, secret=webhook_secret
        )
        metadata = event["data"]["object"]["metadata"]
        kv.delete(metadata["mealId"])
    except Exception as e:
        print(e)
        return {"error": str(e)}

    event_type = event["type"]

    if event_type == "payment_intent.succeeded":
        new_order = Order(meal_id=metadata["mealId"], user_id=metadata["userId"])
        session.add(new_order)
        await session.commit()
        await session.refresh(new_order)
        print(new_order.order_id)
        return {"status": "success", "order_id": new_order.order_id}
    else:
        print(f"unhandled event: {event_type}")

    return {"status": "success"}
