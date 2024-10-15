import logging

import axiom_py  # type: ignore
from axiom_py.logging import AxiomHandler  # type: ignore

from app.core.config import get_settings


class AxiomLogger:
    def __init__(self):
        dataset = get_settings().axiom_dataset
        token = get_settings().axiom_token

        if not (dataset and token):
            raise ValueError("AXIOM_DATASET and AXIOM_TOKEN are required")

        self.client = axiom_py.Client(token)
        self.handler = AxiomHandler(self.client, dataset)

    def setup_logger(self):
        logger = logging.getLogger()
        logger.setLevel(logging.INFO)
        logger.addHandler(self.handler)


axiom = AxiomLogger()
