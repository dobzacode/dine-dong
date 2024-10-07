from mangum import Mangum  # type: ignore

from app.main import app

handler = Mangum(app, lifespan="off")
