import { useState } from 'react';
import axios from 'axios';

const useLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const getMyLeaves = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/leave/my-leaves', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaves(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const applyLeave = async (data) => {
    const res = await axios.post('http://localhost:5000/api/leave/apply', data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  };

  return { leaves, loading, getMyLeaves, applyLeave };
};

export default useLeave;