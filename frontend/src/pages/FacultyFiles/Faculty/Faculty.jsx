import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FacultyLogin = () => {
  const [facultyId, setFacultyId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/faculty/login', { facultyId, password });
      localStorage.setItem('token', response.data.token);
      navigate('/faculty-dashboard');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="content">
      <h1>Faculty Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Faculty ID" value={facultyId} onChange={(e) => setFacultyId(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default FacultyLogin;