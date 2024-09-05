import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, CircularProgress, Box } from '@mui/material';
import { useSnackbar } from 'notistack';

const EmailConfirmation = () => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/confirm/${token}`);
        const data = await response.json();
        
        if (response.ok) {
          setIsConfirmed(true);
          enqueueSnackbar('Email confirmed successfully. You can now log in.', { variant: 'success' });
        } else {
          const errorMessage = data.msg === 'Invalid or expired confirmation link' 
            ? 'Your confirmation link has expired. Please register again. Links are valid for 15 minutes.'
            : data.msg || 'Confirmation failed. Please try registering again.';
          enqueueSnackbar(errorMessage, { variant: 'error' });
        }
      } catch (error) {
        console.error('Error:', error);
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
      ) : (
        <Typography variant="h6" color={isConfirmed ? 'success.main' : 'error.main'}>
          {isConfirmed ? 'Email confirmed successfully' : 'Confirmation failed'}
        </Typography>
      )}
    </Box>
  );
};

export default EmailConfirmation;