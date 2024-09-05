import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, Grid, IconButton, InputAdornment 
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { StyledPaper, GreenButton, GreenTabs, GreenTab, GreenTextField } from './styles';
import { useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (location.state && location.state.confirmationMessage) {
      enqueueSnackbar(location.state.confirmationMessage, { variant: 'success' });
    }
  }, [location, enqueueSnackbar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const url = `${process.env.REACT_APP_API_URL}/api/auth/${isLogin ? 'login' : 'register'}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        if (isLogin) {
          onLogin({ email: data.email, token: data.token });
        } else {
          setIsLogin(true);
          setError('Registration successful. Please check your email to confirm your account.');
        }
      } else {
        if (data.msg === 'Please confirm your email before logging in') {
          setError('Please check your email and confirm your account before logging in.');
        } else {
          setError(data.msg || 'An error occurred. Please try again.');
        }
      }
      
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <StyledPaper elevation={3} sx={{ width: '100%', maxWidth: 400, p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ color: '#333' }}>
          {isLogin ? 'Login' : 'Register'}
        </Typography>
        <GreenTabs 
          value={isLogin ? 0 : 1} 
          onChange={(_, newValue) => setIsLogin(newValue === 0)} 
          centered 
          sx={{ mb: 3 }}
        >
          <GreenTab label="LOGIN" />
          <GreenTab label="REGISTER" />
        </GreenTabs>
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <GreenTextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
          <GreenTextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <GreenButton 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={{ mt: 3, mb: 2 }}
          >
            {isLogin ? 'LOGIN' : 'REGISTER'}
          </GreenButton>
        </Box>
      </StyledPaper>
    </Box>
  );
};

export default Auth;