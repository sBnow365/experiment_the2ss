# backend/src/orchestrator/followup_orchestrator.py

from src.utils.context_store import context_store
from src.utils.chat_history_store import chat_history_store
from src.agents.followup_agent import FollowupAgent


class FollowupOrchestrator:

    def __init__(self):

        self.agent = FollowupAgent()

    def handle_followup(self, session_id: str, tab: str, question: str):

        context = context_store.get(session_id, tab)

        if not context:
            return {
                "error": f"No context found for {tab}. Run analysis first."
            }

        history = chat_history_store.get(session_id, tab)

        answer = self.agent.ask(
            tab=tab,
            previous_context=context,
            history=history,
            question=question
        )

        chat_history_store.add(
            session_id=session_id,
            tab=tab,
            question=question,
            answer=answer
        )

        chat_history_store.trim(session_id, tab)

        return {
            "tab": tab,
            "question": question,
            "answer": answer
        }