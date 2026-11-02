// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // The signed-in user's full profile, or null when nobody is signed in
  const loadProfile = async () => {
    const authRes = await axios.get(`${API_URL}/auth/check`, { withCredentials: true });
    if (!authRes.data.authenticated) return null;
    const dataRes = await axios.get(`${API_URL}/data`, { withCredentials: true });
    return {
      username: authRes.data.user.username,
      role: authRes.data.user.role,
      email: dataRes.data.email,
      profilePic: dataRes.data.profilePic,
      joinDate: dataRes.data.joinDate,
      bio: dataRes.data.bio,
      displayName: dataRes.data.displayName,
    };
  };

  useEffect(() => {
    loadProfile().then(setUser).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  const login = async (formData) => {
    await axios.post(`${API_URL}/auth/login`, formData, { withCredentials: true });
    setUser(await loadProfile());
    navigate('/dashboard');
  };

  const updateProfile = async (fields) => {
    await axios.put(`${API_URL}/data/profile`, fields, { withCredentials: true });
    setUser(await loadProfile());
  };

  const logout = async () => {
    await axios.post(`${API_URL}/auth/logout`,{},  { withCredentials: true });
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
