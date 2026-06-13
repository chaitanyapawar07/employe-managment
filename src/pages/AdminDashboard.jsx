import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalLeaves: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0
  });
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [empRes, leaveRes] = await Promise.all([
        axios.get('http://localhost:5000/api/user/all', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/leave/all', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setEmployees(empRes.data || []);
      setLeaves(leaveRes.data || []);
      
      const stats = {
        totalEmployees: empRes.data?.length || 0,
        totalLeaves: leaveRes.data?.length || 0,
        pendingLeaves: leaveRes.data?.filter(l => l.status === 'pending').length || 0,
        approvedLeaves: leaveRes.data?.filter(l => l.status === 'approved').length || 0,
        rejectedLeaves: leaveRes.data?.filter(l => l.status === 'rejected').length || 0
      };
      setStats(stats);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Total Employees</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalEmployees}</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Total Leave Applications</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalLeaves}</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Pending</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'orange' }}>{stats.pendingLeaves}</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Approved</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'green' }}>{stats.approvedLeaves}</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Rejected</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'red' }}>{stats.rejectedLeaves}</p>
        </div>
      </div>

      <h3>All Leave Applications</h3>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Leave Type</th>
            <th>From</th>
            <th>To</th>
            <th>Days</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map(leave => (
            <tr key={leave.id}>
              <td>{leave.employee_name}</td>
              <td>{leave.leave_name}</td>
              <td>{leave.from_date}</td>
              <td>{leave.to_date}</td>
              <td>{leave.total_days}</td>
              <td>{leave.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

<h3>All Employees</h3>
<table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Role</th>
    </tr>
  </thead>
  <tbody>
    {employees.map(emp => (
      <tr key={emp.id}>
        <td>{emp.name}</td>
        <td>{emp.email}</td>
        <td>{emp.role}</td>
      </tr>
    ))}
  </tbody>
</table>

      <p onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', color: 'blue', marginTop: '20px' }}>
        Back to Dashboard
      </p>
    </div>
  );
}

export default AdminDashboard;
