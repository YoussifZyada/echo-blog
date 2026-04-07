import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';

// Imports
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* 1. Login Page (Landing) */}
          <Route path="/" element={<Login />} />
          
          {/* 2. Register Page (The missing route!) */}
          <Route path="/register" element={<Register />} />
          
          {/* 3. Dashboard (Protected Area) */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Optional: Add a 404 Catch-all */}
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;