import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ManageLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/leave/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaves(res.data);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Something went wrong!');
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/leave/approve/${id}`, 
        { remarks: 'Approved by manager' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg('Leave approved!');
      fetchLeaves();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Something went wrong!');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/leave/reject/${id}`,
        { remarks: 'Rejected by manager' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg('Leave rejected!');
      fetchLeaves();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <div className="fade-in" style={{ padding: '20px' }}>
      <h2>Manage Leaves</h2>
      {msg && (
        <div className="alert alert-success">
          <span>✅</span>
          <span>{msg}</span>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Leave Type</th>
            <th>From</th>
            <th>To</th>
            <th>Days</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map(leave => (
            <tr key={leave.id}>
              <td>{leave.employee_name || 'N/A'}</td>
              <td>{leave.leave_name}</td>
              <td>{new Date(leave.from_date).toLocaleDateString()}</td>
              <td>{new Date(leave.to_date).toLocaleDateString()}</td>
              <td>{leave.total_days}</td>
              <td>{leave.reason}</td>
              <td style={{
                color: leave.status === 'approved' ? 'var(--success)' : 
                       leave.status === 'rejected' ? 'var(--error)' : 'orange',
                fontWeight: '600'
              }}>
                {leave.status.toUpperCase()}
              </td>
              <td>
                {leave.status === 'pending' ? (
                  <>
                    <button style={{ backgroundColor: 'var(--success)', color: 'white' }} onClick={() => handleApprove(leave.id)}>Approve</button>
                    <button style={{ backgroundColor: 'var(--error)', color: 'white' }} onClick={() => handleReject(leave.id)}>Reject</button>
                  </>
                ) : (
                  <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Processed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p onClick={() => navigate('/dashboard')} style={{cursor:'pointer', color:'blue'}}>
        Back to Dashboard
      </p>
    </div>
  );
}

export default ManageLeaves;