import { useState } from 'react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'customer', businessName: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      alert('Registration successful! Please log in.');
      window.location.href = '/login';
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Sign Up for Forsa</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '10px' }}>
          <label>Name:</label>
          <input type="text" name="name" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label>
          <input type="email" name="email" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Password:</label>
          <input type="password" name="password" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Role:</label>
          <select name="role" onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
            <option value="customer">Customer</option>
            <option value="business">Business</option>
          </select>
        </div>
        {formData.role === 'business' && (
          <div style={{ marginBottom: '10px' }}>
            <label>Business Name:</label>
            <input type="text" name="businessName" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
          </div>
        )}
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none' }}>Sign Up</button>
      </form>
      
      <p>Already have an account? <a href="/login">Log in here</a></p>
    </div>
  );
}