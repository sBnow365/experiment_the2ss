# backend/src/utils/chat_history_store.py

from collections import defaultdict


class ChatHistoryStore:

    def __init__(self):
        # store conversations per session + tab
        self.store = defaultdict(list)

    def get(self, session_id: str, tab: str):
        return self.store[(session_id, tab)]

    def add(self, session_id: str, tab: str, question: str, answer: str):
        self.store[(session_id, tab)].append({
            "question": question,
            "answer": answer
        })

    def trim(self, session_id: str, tab: str, max_items: int = 6):
        history = self.store[(session_id, tab)]

        if len(history) > max_items:
            self.store[(session_id, tab)] = history[-max_items:]


# IMPORTANT: create global instance
chat_history_store = ChatHistoryStore()