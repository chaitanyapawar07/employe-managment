function Table({ headers, data, renderRow }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }} border="1">
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} style={{ padding: '10px', background: '#f5f5f5' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr><td colSpan={headers.length} style={{ textAlign: 'center', padding: '20px' }}>No data found!</td></tr>
        ) : (
          data.map((item, i) => renderRow(item, i))
        )}
      </tbody>
    </table>
  );
}

export default Table;