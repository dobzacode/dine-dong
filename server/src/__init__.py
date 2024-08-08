

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

from src.config.config import Config
from src.routes import api

load_dotenv()

app = Flask(__name__)
CORS(app)

config = Config().dev_config

app.register_blueprint(api, url_prefix="/api")

