import { useState } from "react";
import {askFollowup} from "../services/api"; // 👈 import saveFollowup

export function useFollowup(sessionId, tab) {

  const [loading, setLoading] = useState(false);

  const [historyMap, setHistoryMap] = useState({
    culture: [],
    geo: [],
    travel: [],
    news: []
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