function Card({ title, value, color = '#2196F3' }) {
  return (
    <div style={{
      padding: '20px',
      borderRadius: '8px',
      background: color,
      color: 'white',
      textAlign: 'center'
    }}>
      <h3 style={{ margin: '0 0 10px' }}>{title}</h3>
      <h2 style={{ margin: 0, fontSize: '32px' }}>{value}</h2>
    </div>
  );
}

export default Card;