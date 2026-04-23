// src/components/TabImages.jsx
import { useTabImages } from "../hooks/useTabImages";

/**
 * Renders a horizontal image strip for a given tab.
 * Place this ABOVE the SimpleMarkdown content in each tab.
 */
export default function TabImages({ tab, placeContext, tabContent }) {
  const { images, loading, error } = useTabImages({
    tab,
    placeContext,
    tabContent,
    enabled: !!(placeContext && tabContent),
  });

  if (loading) {
    return (
      <div style={styles.loadingRow}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={styles.skeleton} />
        ))}
      </div>
    );
  }

  if (error || images.length === 0) return null;

  return (
    <div style={styles.strip}>
      {images.map((img, i) => (
        <a
          key={i}
          href={img.context_url}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.card}
          title={img.title}
        >
          <img
            src={img.url}
            alt={img.title}
            style={styles.image}
            onError={(e) => {
              // hide broken images gracefully
              e.target.parentElement.style.display = "none";
            }}
          />
          <div style={styles.caption}>
            {img.title?.length > 40
              ? img.title.slice(0, 40) + "…"
              : img.title}
          </div>
        </a>
      ))}
    </div>
  );
}

const styles = {
  strip: {
    display: "flex",
    gap: 10,
    overflowX: "auto",
    paddingBottom: 8,
    marginBottom: 20,
    scrollbarWidth: "thin",
  },
  card: {
    flex: "0 0 auto",
    width: 160,
    borderRadius: 8,
    overflow: "hidden",
    background: "#1a1a1a",
    border: "1px solid #333",
    textDecoration: "none",
    cursor: "pointer",
    transition: "transform 0.15s ease, border-color 0.15s ease",
  },
  image: {
    width: "100%",
    height: 110,
    objectFit: "cover",
    display: "block",
  },
  caption: {
    padding: "6px 8px",
    fontSize: 11,
    color: "#aaa",
    lineHeight: 1.3,
  },
  loadingRow: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
  },
  skeleton: {
    width: 160,
    height: 130,
    borderRadius: 8,
    background: "linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s infinite",
  },
};
