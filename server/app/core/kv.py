import requests  # type: ignore

from app.core.config import get_settings


class KV:
    def __init__(self) -> None:
        self.url = get_settings().kv_rest_api_url
        token = get_settings().kv_rest_api_token

        if not (self.url and token):
            raise ValueError("KV Rest API URL and token are required")

        self.headers = {"Authorization": f"Bearer {token}"}

    def get(self, key):
        get_url = f"{self.url}/get/{key}"
        response = requests.get(url=get_url, headers=self.headers)

        return response.json()["result"]

    def set(self, key, value):
        set_url = f"{self.url}/set/{key}/{value}"
        response = requests.get(url=set_url, headers=self.headers)

        return response.json()["result"]

    def delete(self, key):
        del_url = f"{self.url}/del/{key}"
        response = requests.get(url=del_url, headers=self.headers)

        return response.json()["result"]

    def hset(self, key, value):
        hset_url = f"{self.url}/hash/{key}/{value}"
        response = requests.get(url=hset_url, headers=self.headers)

        return response.json()["result"]
