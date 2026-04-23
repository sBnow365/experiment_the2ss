function Section({ title, children }) {
  return (
    <div style={{ marginTop: "25px" }}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export default Section;