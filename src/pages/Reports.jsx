import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Table from '../Table';
import Card from '../Card';
import Loader from '../Loader';

function Reports() {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('employee');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leaveRes, empRes] = await Promise.all([
        axios.get('http://localhost:5000/api/leave/all', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/user/all', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setLeaves(leaveRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Employee wise leave count
  const employeeWise = employees.map(emp => ({
    name: emp.name,
    email: emp.email,
    total: leaves.filter(l => l.employee_id === emp.id).length,
    approved: leaves.filter(l => l.employee_id === emp.id && l.status === 'approved').length,
    pending: leaves.filter(l => l.employee_id === emp.id && l.status === 'pending').length,
    rejected: leaves.filter(l => l.employee_id === emp.id && l.status === 'rejected').length,
  }));

  // Monthly trend
  const monthlyTrend = leaves.reduce((acc, leave) => {
    const month = new Date(leave.created_at).toLocaleString('default', { month: 'long', year: 'numeric' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  // Most absent employee
  const mostAbsent = [...employeeWise].sort((a, b) => b.approved - a.approved).slice(0, 5);

  return (
    <div style={{ padding: '20px' }}>
      <h2>HR Reports</h2>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
        <Card title="Total Leaves" value={leaves.length} color="#2196F3" />
        <Card title="Approved" value={leaves.filter(l => l.status === 'approved').length} color="#4CAF50" />
        <Card title="Pending" value={leaves.filter(l => l.status === 'pending').length} color="#FF9800" />
        <Card title="Rejected" value={leaves.filter(l => l.status === 'rejected').length} color="#f44336" />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {['employee', 'monthly', 'absent'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer',
              background: activeTab === tab ? '#2196F3' : '#eee',
              color: activeTab === tab ? 'white' : 'black'
            }}>
            {tab === 'employee' ? 'Employee Wise' : tab === 'monthly' ? 'Monthly Trend' : 'Most Absent'}
          </button>
        ))}
      </div>

      {loading ? <Loader /> : (
        <>
          {/* Employee Wise */}
          {activeTab === 'employee' && (
            <Table
              headers={['Name', 'Email', 'Total', 'Approved', 'Pending', 'Rejected']}
              data={employeeWise}
              renderRow={(emp, i) => (
                <tr key={i}>
                  <td style={{ padding: '10px' }}>{emp.name}</td>
                  <td style={{ padding: '10px' }}>{emp.email}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{emp.total}</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: 'green' }}>{emp.approved}</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: 'orange' }}>{emp.pending}</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: 'red' }}>{emp.rejected}</td>
                </tr>
              )}
            />
          )}

          {/* Monthly Trend */}
          {activeTab === 'monthly' && (
            <Table
              headers={['Month', 'Total Leaves']}
              data={Object.entries(monthlyTrend)}
              renderRow={([month, count], i) => (
                <tr key={i}>
                  <td style={{ padding: '10px' }}>{month}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{count}</td>
                </tr>
              )}
            />
          )}

          {/* Most Absent */}
          {activeTab === 'absent' && (
            <Table
              headers={['Rank', 'Name', 'Approved Leaves']}
              data={mostAbsent}
              renderRow={(emp, i) => (
                <tr key={i}>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{i + 1}</td>
                  <td style={{ padding: '10px' }}>{emp.name}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{emp.approved}</td>
                </tr>
              )}
            />
          )}
        </>
      )}

      <br />
      <button onClick={() => navigate('/dashboard')}
        style={{ padding: '10px 20px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default Reports;
