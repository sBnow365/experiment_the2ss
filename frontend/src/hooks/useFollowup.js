import { useState } from "react";
import {askFollowup} from "../services/api"; // 👈 import saveFollowup

export function useFollowup(sessionId, tab, initialHistory = []) {

  const [loading, setLoading] = useState(false);

  const [historyMap, setHistoryMap] = useState({
    culture: initialHistory.filter(c => c.tab === "culture"),
    geo: initialHistory.filter(c => c.tab === "geo"),
    travel: initialHistory.filter(c => c.tab === "travel"),
    news: initialHistory.filter(c => c.tab === "news")
  });

  const history = historyMap[tab] || [];

  async function ask(question) {

    setLoading(true);

    try {

      const res = await askFollowup(sessionId, tab, question, history);

      const newEntry = {
        question,
        answer: res.answer
      };

      // update local UI state
      setHistoryMap(prev => ({
        ...prev,
        [tab]: [...prev[tab], newEntry]
      }));

      // ✅ persist to MongoDB
      // await saveFollowup(sessionId, tab, question, res.answer);

    } finally {
      setLoading(false);
    }
  }

  return { ask, history, loading };
}