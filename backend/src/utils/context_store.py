# backend/src/utils/context_store.py

from typing import Dict
from threading import Lock


class ContextStore:
    """
    Stores analysis results for each session.
    """

    def __init__(self):
        self.store: Dict[str, Dict] = {}
        self.lock = Lock()

    def save(self, session_id: str, tab: str, data: str):
        with self.lock:
            if session_id not in self.store:
                self.store[session_id] = {}

            self.store[session_id][tab] = data

    def get(self, session_id: str, tab: str):

        if session_id not in self.store:
            return None

        return self.store[session_id].get(tab)

    def get_all(self, session_id: str):
        return self.store.get(session_id, {})


context_store = ContextStore()