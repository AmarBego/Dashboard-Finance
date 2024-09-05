import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useSnackbar } from 'notistack';

const EmailConfirmation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/confirm/${token}`);
        const data = await response.json();
        
        if (response.ok) {
          enqueueSnackbar('Email confirmed successfully. You can now log in.', { variant: 'success' });
        } else {
          setError(data.msg || 'Confirmation failed. Please try registering again.');
          enqueueSnackbar(data.msg || 'Confirmation failed. Please try registering again.', { variant: 'error' });
        }
      } catch (error) {
        console.error('Error:', error);
        setError('An error occurred. Please try again.');
        enqueueSnackbar('An error occurred. Please try again.', { variant: 'error' });
      } finally {
        setIsLoading(false);
        setTimeout(() => navigate('/login'), 3000);
      }
    };
  
    confirmEmail();
  }, [token, navigate, enqueueSnackbar]);

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh">
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      ) : (
        <Typography variant="h6" color="success.main">
          Email confirmed successfully. Redirecting to login page...
        </Typography>
      )}
    </Box>
  );
};

export default EmailConfirmation;