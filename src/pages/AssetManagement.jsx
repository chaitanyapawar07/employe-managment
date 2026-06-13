import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AssetManagement() {
  const [assets, setAssets] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [msg, setMsg] = useState('');
  const [activeTab, setActiveTab] = useState('assets');
  const [newAsset, setNewAsset] = useState({ asset_name: '', asset_type: '', serial_number: '' });
  const [allocation, setAllocation] = useState({ asset_id: '', employee_id: '' });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [assetsRes, allocRes, empRes] = await Promise.all([
        axios.get('http://localhost:5000/api/assets', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/assets/allocations', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/user/all', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setAssets(assetsRes.data);
      setAllocations(allocRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      setMsg('Something went wrong!');
    }
  };

  const handleAddAsset = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/assets', newAsset, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg('Asset added!');
      setNewAsset({ asset_name: '', asset_type: '', serial_number: '' });
      fetchData();
    } catch (err) {
      setMsg('Failed to add asset!');
    }
  };

  const handleAllocate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/assets/allocate', allocation, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg('Asset allocated!');
      setAllocation({ asset_id: '', employee_id: '' });
      fetchData();
    } catch (err) {
      setMsg('Failed to allocate!');
    }
  };

  const handleReturn = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/assets/return/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg('Asset returned!');
      fetchData();
    } catch (err) {
      setMsg('Failed to return!');
    }
  };

  const tabStyle = (tab) => ({
    padding: '8px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer',
    background: activeTab === tab ? '#4ecdc4' : '#2a2a3e',
    color: activeTab === tab ? '#fff' : '#aaa', fontWeight: '500'
  });

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ color: '#fff', marginBottom: '20px' }}>🖥️ Asset Management</h2>
      {msg && <p style={{ color: '#4ecdc4' }}>{msg}</p>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        <button style={tabStyle('assets')} onClick={() => setActiveTab('assets')}>All Assets</button>
        <button style={tabStyle('add')} onClick={() => setActiveTab('add')}>Add Asset</button>
        <button style={tabStyle('allocate')} onClick={() => setActiveTab('allocate')}>Allocate</button>
        <button style={tabStyle('allocations')} onClick={() => setActiveTab('allocations')}>Allocations</button>
      </div>

      {/* All Assets */}
      {activeTab === 'assets' && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1a1a2e' }}>
              <th style={{ padding: '12px', color: '#4ecdc4', borderBottom: '2px solid #4ecdc4', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '12px', color: '#4ecdc4', borderBottom: '2px solid #4ecdc4', textAlign: 'left' }}>Asset Name</th>
              <th style={{ padding: '12px', color: '#4ecdc4', borderBottom: '2px solid #4ecdc4', textAlign: 'left' }}>Type</th>
              <th style={{ padding: '12px', color: '#4ecdc4', borderBottom: '2px solid #4ecdc4', textAlign: 'left' }}>Serial No</th>
              <th style={{ padding: '12px', color: '#4ecdc4', borderBottom: '2px solid #4ecdc4', textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, i) => (
              <tr key={asset.id} style={{ background: i % 2 === 0 ? '#16213e' : '#1a1a2e' }}>
                <td style={{ padding: '12px', color: '#fff', borderBottom: '1px solid #333' }}>{asset.id}</td>
                <td style={{ padding: '12px', color: '#fff', borderBottom: '1px solid #333' }}>{asset.asset_name}</td>
                <td style={{ padding: '12px', color: '#fff', borderBottom: '1px solid #333' }}>{asset.asset_type}</td>
                <td style={{ padding: '12px', color: '#fff', borderBottom: '1px solid #333' }}>{asset.serial_number}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #333' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '12px', background: asset.status === 'available' ? '#4CAF50' : '#ff6b6b', color: '#fff', fontSize: '12px' }}>
                    {asset.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Asset */}
      {activeTab === 'add' && (
        <form onSubmit={handleAddAsset} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px' }}>
          <input placeholder="Asset Name" value={newAsset.asset_name}
            onChange={e => setNewAsset({...newAsset, asset_name: e.target.value})}
            style={{ padding: '10px', borderRadius: '8px', background: '#2a2a3e', color: '#fff', border: '1px solid #444' }} />
          <select value={newAsset.asset_type} onChange={e => setNewAsset({...newAsset, asset_type: e.target.value})}
            style={{ padding: '10px', borderRadius: '8px', background: '#2a2a3e', color: '#fff', border: '1px solid #444' }}>
            <option value="">Select Type</option>
            <option>Laptop</option>
            <option>Monitor</option>
            <option>ID Card</option>
            <option>Mouse</option>
            <option>Keyboard</option>
          </select>
          <input placeholder="Serial Number" value={newAsset.serial_number}
            onChange={e => setNewAsset({...newAsset, serial_number: e.target.value})}
            style={{ padding: '10px', borderRadius: '8px', background: '#2a2a3e', color: '#fff', border: '1px solid #444' }} />
          <button type="submit" style={{ padding: '12px', background: '#4ecdc4', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            Add Asset
          </button>
        </form>
      )}

      {/* Allocate */}
      {activeTab === 'allocate' && (
        <form onSubmit={handleAllocate} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px' }}>
          <select value={allocation.asset_id} onChange={e => setAllocation({...allocation, asset_id: e.target.value})}
            style={{ padding: '10px', borderRadius: '8px', background: '#2a2a3e', color: '#fff', border: '1px solid #444' }}>
            <option value="">Select Asset</option>
            {assets.filter(a => a.status === 'available').map(a => (
              <option key={a.id} value={a.id}>{a.asset_name} — {a.serial_number}</option>
            ))}
          </select>
          <select value={allocation.employee_id} onChange={e => setAllocation({...allocation, employee_id: e.target.value})}
            style={{ padding: '10px', borderRadius: '8px', background: '#2a2a3e', color: '#fff', border: '1px solid #444' }}>
            <option value="">Select Employee</option>
            {employees.map(e => (
              <option key={e.id} value={e.id}>{e.name} — {e.email}</option>
            ))}
          </select>
          <button type="submit" style={{ padding: '12px', background: '#4ecdc4', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            Allocate Asset
          </button>
        </form>
      )}

      {/* Allocations */}
      {activeTab === 'allocations' && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1a1a2e' }}>
              <th style={{ padding: '12px', color: '#4ecdc4', borderBottom: '2px solid #4ecdc4', textAlign: 'left' }}>Employee</th>
              <th style={{ padding: '12px', color: '#4ecdc4', borderBottom: '2px solid #4ecdc4', textAlign: 'left' }}>Asset</th>
              <th style={{ padding: '12px', color: '#4ecdc4', borderBottom: '2px solid #4ecdc4', textAlign: 'left' }}>Type</th>
              <th style={{ padding: '12px', color: '#4ecdc4', borderBottom: '2px solid #4ecdc4', textAlign: 'left' }}>Allocated At</th>
              <th style={{ padding: '12px', color: '#4ecdc4', borderBottom: '2px solid #4ecdc4', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px', color: '#4ecdc4', borderBottom: '2px solid #4ecdc4', textAlign: 'left' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map((alloc, i) => (
              <tr key={alloc.id} style={{ background: i % 2 === 0 ? '#16213e' : '#1a1a2e' }}>
                <td style={{ padding: '12px', color: '#fff', borderBottom: '1px solid #333' }}>{alloc.employee_name}</td>
                <td style={{ padding: '12px', color: '#fff', borderBottom: '1px solid #333' }}>{alloc.asset_name}</td>
                <td style={{ padding: '12px', color: '#fff', borderBottom: '1px solid #333' }}>{alloc.asset_type}</td>
                <td style={{ padding: '12px', color: '#fff', borderBottom: '1px solid #333' }}>{new Date(alloc.allocated_at).toLocaleDateString()}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #333' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '12px', background: alloc.status === 'allocated' ? '#FF9800' : '#4CAF50', color: '#fff', fontSize: '12px' }}>
                    {alloc.status}
                  </span>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #333' }}>
                  {alloc.status === 'allocated' && (
                    <button onClick={() => handleReturn(alloc.id)}
                      style={{ padding: '6px 12px', background: '#ff6b6b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                      Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <br />
      <button onClick={() => navigate('/dashboard')}
        style={{ padding: '10px 20px', background: '#2196F3', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        ← Back to Dashboard
      </button>
    </div>
  );
}

export default AssetManagement;