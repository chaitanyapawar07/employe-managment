import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        'https://employe-managment.onrender.com/api/auth/forgot-password',
        { email }
      );
      setMsg(res.data.message);
    } catch (err) {
      setMsg('Something went wrong!');
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button onClick={handleSubmit}>Send Reset Link</button>
      {msg && <p>{msg}</p>}
      <p onClick={() => navigate('/')}>Back to Login</p>
    </div>
  );
}

export default ForgotPassword;
