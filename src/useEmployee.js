import { useState } from 'react';
import axios from 'axios';

const useEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const getEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://employe-managment.onrender.com/api/user/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return { employees, loading, getEmployees };
};

export default useEmployee;
