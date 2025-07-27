import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthContext/AuthContext';
import { dummyData } from '../../../Data/DummyData';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const adminData = dummyData.admin;
    if (username === adminData.username && password === adminData.password) {
      login(adminData.token, adminData.role);
      navigate('/admin-dashboard');
    } else {
      setError('Invalid username or password');
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <h1>Admin Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        <input
        className='input'
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
        className='input'
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;