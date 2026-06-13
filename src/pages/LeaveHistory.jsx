import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LeaveHistory() {
  const [leaves, setLeaves] = useState([]);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/leave/my-leaves', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaves(res.data);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <div>
      <h2>My Leave History</h2>
      {msg && <p>{msg}</p>}
      {leaves.length === 0 ? (
        <p>No leaves applied yet!</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Leave Type</th>
              <th>From</th>
              <th>To</th>
              <th>Days</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map(leave => (
              <tr key={leave.id}>
                <td>{leave.leave_name}</td>
                <td>{new Date(leave.from_date).toLocaleDateString()}</td>
                <td>{new Date(leave.to_date).toLocaleDateString()}</td>
                <td>{leave.total_days}</td>
                <td>{leave.reason}</td>
                <td style={{
                  color: leave.status === 'approved' ? 'green' : 
                         leave.status === 'rejected' ? 'red' : 'orange'
                }}>
                  {leave.status.toUpperCase()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p onClick={() => navigate('/dashboard')} style={{cursor:'pointer', color:'blue'}}>
        Back to Dashboard
      </p>
    </div>
  );
}

export default LeaveHistory;