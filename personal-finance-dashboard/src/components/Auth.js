import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Paper, Tab, Tabs } from '@mui/material';
import { motion } from 'framer-motion';

const MotionPaper = motion(Paper);

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const url = `http://localhost:5000/api/auth/${isLogin ? 'login' : 'register'}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        if (isLogin) {
          onLogin({ email, token: data.token });
        } else {
          setIsLogin(true);
          setError('Registration successful. Please log in.');
        }
      } else {
        setError(data.msg);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };


  return (
    <MotionPaper
      elevation={3}
      sx={{ p: 4, maxWidth: 400, margin: 'auto', mt: 8 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs value={isLogin ? 0 : 1} onChange={(_, newValue) => setIsLogin(newValue === 0)} centered sx={{ mb: 3 }}>
        <Tab label="Login" />
        <Tab label="Register" />
      </Tabs>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, mb: 2 }}>
          {isLogin ? 'Login' : 'Register'}
        </Button>
      </Box>
    </MotionPaper>
  );
};

export default Auth;