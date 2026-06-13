import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function Verify() {
  const [msg, setMsg] = useState('Verifying...');
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/auth/verify-email/${token}`)
      .then(res => {
        setMsg(res.data.message);
        setTimeout(() => navigate('/'), 3000);
      })
      .catch(() => {
        setMsg('Link expired or invalid!');
      });
  }, []);

  return (
    <div>
      <h2>{msg}</h2>
      {msg === 'Email verified successfully!' && (
        <p>Redirecting to login in 3 seconds...</p>
      )}
    </div>
  );
}

export default Verify;