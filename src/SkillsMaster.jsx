import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SkillsMaster() {
  const [skills, setSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://employe-managment.onrender.com/api/skills', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSkills(res.data);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    try {
      await axios.post('https://employe-managment.onrender.com/api/skills', 
        { skill_name: newSkillName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewSkillName('');
      setMsg('Skill added successfully!');
      fetchSkills();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to add skill');
    }
  };

  return (
    <div className="fade-in" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Skills Master</h2>
      {msg && (
        <div className={`alert ${msg.includes('success') ? 'alert-success' : 'alert-error'}`}>
          <span>{msg.includes('success') ? '✅' : '⚠️'}</span>
          <span>{msg}</span>
        </div>
      )}

      {/* Add Skill Form */}
      <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="New Skill Name"
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          className="form-input"
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn-primary" style={{ marginTop: 0, width: 'auto' }}>
          Add Skill
        </button>
      </form>

      {/* Skills List Table */}
      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Loading skills...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Skill Name</th>
            </tr>
          </thead>
          <tbody>
            {skills.length === 0 ? (
              <tr>
                <td colSpan="2" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No skills found.</td>
              </tr>
            ) : (
              skills.map((skill) => (
                <tr key={skill.id}>
                  <td>{skill.id}</td>
                  <td>{skill.skill_name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      <p onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', color: 'var(--primary-accent)', textAlign: 'center', marginTop: '20px', fontWeight: '500' }}>
        ← Back to Dashboard
      </p>
    </div>
  );
}

export default SkillsMaster;
