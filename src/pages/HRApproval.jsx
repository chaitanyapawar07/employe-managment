import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Table from '../Table';
import Button from '../Button';
import Loader from '../Loader';

function HRApproval() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/leave/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaves(res.data.filter(l => l.status === 'approved'));
    } catch (err) {
      setMsg('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/leave/final-approve/${id}`,
        { remarks: 'Final approved by HR' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg('Final approval done!');
      fetchLeaves();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Something went wrong!');
    }
  };

  const headers = ['Employee', 'Leave Type', 'From', 'To', 'Days', 'Status', 'Action'];

  return (
    <div style={{ padding: '20px' }}>
      <h2>HR Final Approval</h2>
      {msg && <p style={{ color: 'green' }}>{msg}</p>}
      {loading ? <Loader /> : (
        <Table
          headers={headers}
          data={leaves}
          renderRow={(leave, i) => (
            <tr key={i}>
              <td style={{ padding: '10px' }}>{leave.employee_name}</td>
              <td style={{ padding: '10px' }}>{leave.leave_name}</td>
              <td style={{ padding: '10px' }}>{new Date(leave.from_date).toLocaleDateString()}</td>
              <td style={{ padding: '10px' }}>{new Date(leave.to_date).toLocaleDateString()}</td>
              <td style={{ padding: '10px' }}>{leave.total_days}</td>
              <td style={{ padding: '10px', color: 'orange' }}>{leave.status.toUpperCase()}</td>
              <td style={{ padding: '10px' }}>
                <Button text="Final Approve" color="green" onClick={() => handleFinalApprove(leave.id)} />
              </td>
            </tr>
          )}
        />
      )}
      <br />
      <Button text="Back to Dashboard" color="blue" onClick={() => navigate('/dashboard')} />
    </div>
  );
}

export default HRApproval;
