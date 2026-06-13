import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LeaveApplication() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [formData, setFormData] = useState({
    leave_type_id: '',
    from_date: '',
    to_date: '',
    reason: ''
  });
  const [msg, setMsg] = useState('');
  const [loadError, setLoadError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/leave/types', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      setLeaveTypes(res.data || []);
      if (!res.data || res.data.length === 0) {
        setLoadError('No leave types are configured. Please contact your administrator.');
      }
    }).catch(err => {
      console.error('Leave types load failed:', err.response?.data?.message || err.message);
      setLoadError('Failed to load leave types. Please refresh or contact your administrator.');
      setLeaveTypes([]);
    });
  }, []);

  const handleSubmit = async () => {
    if (!formData.leave_type_id || !formData.from_date || !formData.to_date || !formData.reason) {
      setMsg('Please fill in all required fields.');
      return;
    }

    const fromDate = new Date(formData.from_date);
    const toDate = new Date(formData.to_date);
    if (toDate < fromDate) {
      setMsg('End date must be the same as or after start date.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/leave/apply', {
        ...formData,
        leave_type_id: parseInt(formData.leave_type_id, 10)
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMsg('Leave applied successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <div>
      <h2>Apply Leave</h2>
      <select
        value={formData.leave_type_id}
        onChange={e => setFormData({...formData, leave_type_id: e.target.value})}
      >
        <option value="" disabled>Select Leave Type</option>
        {leaveTypes.map(lt => (
          <option key={lt.id || lt.leave_type_id} value={lt.id || lt.leave_type_id}>
            {lt.leave_name || lt.name || 'Unnamed leave type'}
          </option>
        ))}
      </select>
      {loadError && <p style={{ color: 'red' }}>{loadError}</p>}
      <input
        type="date"
        value={formData.from_date}
        onChange={e => setFormData({...formData, from_date: e.target.value})}
      />
      <input
        type="date"
        value={formData.to_date}
        onChange={e => setFormData({...formData, to_date: e.target.value})}
      />
      <textarea
        placeholder="Reason for leave"
        value={formData.reason}
        onChange={e => setFormData({...formData, reason: e.target.value})}
      />
      <button onClick={handleSubmit} disabled={!leaveTypes.length || !!loadError}>
        Apply Leave
      </button>
      {msg && <p>{msg}</p>}
      <p onClick={() => navigate('/dashboard')} style={{cursor:'pointer', color:'blue'}}>
        Back to Dashboard
      </p>
    </div>
  );
}

export default LeaveApplication;
