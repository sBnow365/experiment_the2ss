// src/hooks/useTabImages.js
import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../config/env";

/**
 * Fetches contextual images for a tab after main analysis completes.
 *
 * @param {object} params
 * @param {string} params.tab          - "culture" | "geo" | "travel"
 * @param {string} params.placeContext - place string from data.place
 * @param {string} params.tabContent   - markdown content for this tab
 * @param {boolean} params.enabled     - only fetch when data is ready
 */
export function useTabImages({ tab, placeContext, tabContent, enabled }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled || !placeContext || !tabContent) return;

    let cancelled = false;

    async function fetchImages() {
      setLoading(true);
      setError(null);
      try {
                const res = await axios.post(`${API_BASE}/images`, {
        tab,
        place_context: typeof placeContext === "string" 
            ? placeContext 
            : JSON.stringify(placeContext),
        tab_content: tabContent,
        });
        if (!cancelled) {
          setImages(res.data.images || []);
        }
      } catch (err) {
        if (!cancelled) setError("Could not load images");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchImages();
    return () => { cancelled = true; };

  // Only re-fetch if tab or content changes (not on every render)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, placeContext, tabContent, enabled]);

  return { images, loading, error };
}
