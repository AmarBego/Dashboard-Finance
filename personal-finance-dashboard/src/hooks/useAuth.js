import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const username = localStorage.getItem('username');
    if (token && email) {
      setUser({ email, username: username || 'User', token });
    }
  }, []);

  const handleLogin = (userData) => {
    userData.username = userData.username || 'User';
    setUser(userData);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('email', userData.email);
    localStorage.setItem('username', userData.username);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('username');
  };

  return { user, handleLogin, handleLogout };
}