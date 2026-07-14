import { createContext, useContext, useState, useEffect } from 'react';
import { loginRequest, meRequest } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Al montar: si hay token guardado, verificarlo
  useEffect(() => {
  if (!token) { setLoading(false); return; }
  meRequest(token)
    .then(data => setUser(data.user))
    .catch(() => { localStorage.removeItem('token'); setToken(null); })
    .finally(() => setLoading(false));
}, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (usuario, contrasena) => {
    const data = await loginRequest(usuario, contrasena);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);