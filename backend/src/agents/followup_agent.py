# backend/src/agents/followup_agent.py

import google.generativeai as genai
from src.config.settings import GEMINI_API_KEY


class FollowupAgent:

    def __init__(self):

        genai.configure(api_key=GEMINI_API_KEY)

        self.model = genai.GenerativeModel("gemini-2.5-flash-lite")

    def ask(self, tab: str, previous_context: str, history: list, question: str):

        history_text = ""

        for item in history:
            history_text += f"""
User: {item['question']}
Assistant: {item['answer']}
"""

        prompt = f"""
You are an expert assistant for travel, culture and geography.

TAB CONTEXT:
{tab}

BASE ANALYSIS:
{previous_context}

CONVERSATION HISTORY:
{history_text}

USER QUESTION:
{question}

Rules:
- Use the conversation history to resolve pronouns like "he", "she", "they".
- If the previous discussion was about a specific person, assume the user continues referring to that person.
- Do NOT introduce unrelated people unless the user explicitly asks.
- If the context is insufficient to accurately answer the question , answer from your own knowledege as an expert
- Answer clearly and concisely.
"""

        response = self.model.generate_content(prompt)

        return response.text