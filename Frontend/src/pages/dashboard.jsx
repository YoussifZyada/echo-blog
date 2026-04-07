import React from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom>Dashboard</Typography>
        <Typography variant="h5" color="textSecondary">
          Hello, {user?.username || 'User'}!
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography><strong>Email:</strong> {user?.email}</Typography>
          <Typography><strong>Role:</strong> {user?.role}</Typography>
        </Box>
        <Button variant="contained" color="error" sx={{ mt: 4 }} onClick={handleLogout}>
          Logout
        </Button>
      </Paper>
    </Container>
  );
};

export default Dashboard;