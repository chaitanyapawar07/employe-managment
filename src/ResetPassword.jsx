import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/reset-password',
        { token, newPassword }
      );
      setMsg(res.data.message);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setMsg('Link expired or invalid!');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
      />
      <button onClick={handleReset}>Reset Password</button>
      {msg && <p>{msg}</p>}
    </div>
  );
}

export default ResetPassword;