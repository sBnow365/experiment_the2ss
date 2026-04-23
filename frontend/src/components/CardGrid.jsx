function CardGrid({ items }) {
  if (!items) return null;

  return (
    <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #444",
            padding: "10px",
            borderRadius: "8px",
            width: "220px"
          }}
        >
          <h3>{item.name||item.season}</h3>
          <p>{item.summary}</p>
        </div>
      ))}
    </div>
  );
}

export default CardGrid;