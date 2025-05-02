// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authRes = await axios.get('http://localhost:8080/auth/check', {
          withCredentials: true,
        });

        if (authRes.data.authenticated) {
          const dataRes = await axios.get('http://localhost:8080/data', {
            withCredentials: true,
          });

          setUser({
            username: authRes.data.user.username,
            role: authRes.data.user.role,
            email: dataRes.data.email,
            profilePic: dataRes.data.profilePic,
          });
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (formData) => {
    await axios.post("http://localhost:8080/auth/login", formData, {
      withCredentials: true,
    });

    const authRes = await axios.get("http://localhost:8080/auth/check", {
      withCredentials: true,
    });
    const dataRes = await axios.get("http://localhost:8080/data", {
      withCredentials: true,
    });

   
    setUser({
      username: authRes.data.user.username,
      role: authRes.data.user.role,
      email: dataRes.data.email,
      profilePic: dataRes.data.profilePic,
      joinDate: dataRes.data.joinDate
    });

    navigate('/dashboard');
  };

  const logout = async () => {
    await axios.post("http://localhost:8080/auth/logout",{},  { withCredentials: true });
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
