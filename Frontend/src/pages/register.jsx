import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Paper, Alert, Link } from '@mui/material';
import { registerUser } from '../api/auth';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration Failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
            JOIN ECHO
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleRegister}>
            <TextField fullWidth label="Username" margin="normal" onChange={(e) => setFormData({...formData, username: e.target.value})} required />
            <TextField fullWidth label="Email" type="email" margin="normal" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            <TextField fullWidth label="Password" type="password" margin="normal" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
            <Button fullWidth variant="contained" type="submit" size="large" sx={{ mt: 3 }}>Create Account</Button>
          </form>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link component={RouterLink} to="/" variant="body2">Already have an account? Login</Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;