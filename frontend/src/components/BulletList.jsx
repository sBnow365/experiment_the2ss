function BulletList({ items }) {
  if (!items) return null;

  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export default BulletList;