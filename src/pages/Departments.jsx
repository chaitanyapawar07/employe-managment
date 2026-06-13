import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [newDeptName, setNewDeptName] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://employe-managment.onrender.com/api/departments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDepartments(res.data);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;
    try {
      await axios.post('https://employe-managment.onrender.com/api/departments', 
        { department_name: newDeptName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewDeptName('');
      setMsg('Department added successfully!');
      fetchDepartments();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to add department');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Departments</h2>
      {msg && <p style={{ color: msg.includes('success') ? 'green' : 'red', fontWeight: 'bold' }}>{msg}</p>}

      {/* Add Department Form */}
      <form onSubmit={handleAddDepartment} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="New Department Name"
          value={newDeptName}
          onChange={(e) => setNewDeptName(e.target.value)}
          style={{ padding: '10px', fontSize: '16px', flex: 1, borderRadius: '8px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '10px 20px', fontSize: '16px', borderRadius: '8px', cursor: 'pointer', background: '#4ecdc4', color: 'white', border: 'none', fontWeight: 'bold' }}>
          Add Dept
        </button>
      </form>

      {/* Department List Table */}
      {loading ? (
        <p>Loading departments...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr style={{ background: '#07060a', textAlign: 'left' }}>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>ID</th>
              <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Department Name</th>
            </tr>
          </thead>
          <tbody>
            {departments.length === 0 ? (
              <tr>
                <td colSpan="2" style={{ padding: '12px', textAlign: 'center' }}>No departments found.</td>
              </tr>
            ) : (
              departments.map((dept) => (
                <tr key={dept.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px' }}>{dept.id}</td>
                  <td style={{ padding: '12px' }}>{dept.department_name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      <button onClick={() => navigate('/dashboard')}
        style={{ padding: '10px 20px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default Departments;
