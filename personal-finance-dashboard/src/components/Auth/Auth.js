import React, { useState } from 'react';
import { 
  Typography, Box, Grid, IconButton, InputAdornment 
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person'; // Added for the username field
import { StyledPaper, GreenButton, GreenTabs, GreenTab, GreenTextField } from './styles';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const url = `${process.env.REACT_APP_API_URL}/api/auth/${isLogin ? 'login' : 'register'}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isLogin ? { email, password } : { username, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        if (isLogin) {
          onLogin({ email: data.email, username: data.username, token: data.token });
        } else {
          setIsLogin(true);
          setError('Registration successful. Please log in.');
        }
      } else {
        setError(data.msg || 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  const checkUsername = async (username) => {
    if (username.length >= 3 && username.length <= 20) {
      if (!/^[a-zA-Z0-9-]+$/.test(username)) {
        setUsernameError('Username can only contain letters, numbers, and hyphens');
        return;
      }
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/check-username`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }),
        });
        const data = await response.json();
        if (data.exists) {
          setUsernameError('Username is already taken');
        } else {
          setUsernameError('');
        }
      } catch (error) {
        console.error('Error checking username:', error);
      }
    } else if (username.length > 20) {
      setUsernameError('Username must be 20 characters or less');
    } else {
      setUsernameError('');
    }
  };
  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <StyledPaper elevation={3}>
          <Typography variant="h4" align="center" gutterBottom>
            {isLogin ? 'Login' : 'Register'}
          </Typography>
          <GreenTabs 
            value={isLogin ? 0 : 1} 
            onChange={(_, newValue) => setIsLogin(newValue === 0)} 
            centered 
            sx={{ mb: 3 }}
          >
            <GreenTab label="Login" />
            <GreenTab label="Register" />
          </GreenTabs>
          {error && (
            <Typography color="error" align="center" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            {!isLogin && (
              <GreenTextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  checkUsername(e.target.value);
                }}
                margin="normal"
                required
                error={!!usernameError}
                helperText={usernameError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon /> {/* Added for the username field */}
                    </InputAdornment>
                  ),
                }}
              />
            )}
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
              disabled={!isLogin && !!usernameError}
            >
              {isLogin ? 'Login' : 'Register'}
            </GreenButton>
          </Box>
        </StyledPaper>
      </Grid>
    </Grid>
  );
};

export default Auth;