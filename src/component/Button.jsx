function Button({ text, onClick, color = 'blue', type = 'button' }) {
  const styles = {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    background: color === 'blue' ? '#2196F3' :
                color === 'green' ? '#4CAF50' :
                color === 'red' ? '#f44336' : '#FF9800',
    color: 'white'
  };

  return (
    <button type={type} onClick={onClick} style={styles}>
      {text}
    </button>
  );
}

export default Button;
