from fastapi import APIRouter, Header, HTTPException, Request, Security
from stripe import stripe  # type: ignore

from app.core.config import get_settings
from app.core.security.authenticate import VerifyToken
from app.schemas.requests import CreatePaymentIntentRequest

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
            metadata={"userId": request.userId},
        )
        return {"status": "success", "clientSecret": payment_intent.client_secret}
    except Exception as e:
        raise HTTPException(status_code=403, detail=str(e))


@router.post("/webhooks")
async def webhook_received(request: Request, stripe_signature: str = Header(None)):
    data = await request.body()
    try:
        event = stripe.Webhook.construct_event(
            payload=data, sig_header=stripe_signature, secret=webhook_secret
        )
        event_data = event["data"]["object"]
    except Exception as e:
        print(e)
        return {"error": str(e)}

    event_type = event["type"]
    print(event_data)
    if event_type == "payment_intent.succeeded":
        print("payment intent succeeded")
    else:
        print(f"unhandled event: {event_type}")

    return {"status": "success"}
