function TravelCard({ option }) {

  if (!option) return null;

//   const budgetIcon =
//     option.budget_level === "Low"
//       ? "💰"
//       : option.budget_level === "Medium"
//       ? "💳"
//       : "💎";

  return (
    <div
      style={{
        border: "1px solid #444",
        borderRadius: "10px",
        padding: "15px",
        width: "260px",
        background: "#1e1e1e",
        color: "white"
      }}
    >
      <h3>
         {option.budget_level} Budget
      </h3>

      <p>
        <strong>Cost:</strong> ${option.approx_cost_usd}
      </p>

      <p>
        <strong>Method:</strong> {option.method}
      </p>

      <p>
        <strong>Timeline:</strong> {option.timeline}
      </p>

      {option.steps && (
        <>
          <strong>Steps</strong>
          <ul>
            {option.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default TravelCard;