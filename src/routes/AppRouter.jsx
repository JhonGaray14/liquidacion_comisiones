import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import MainLayout    from '../components/layout/MainLayout';
import Login         from '../pages/Login';
import Dashboard     from '../pages/Dashboard';
import CargaDatos    from '../pages/CargaDatos';
import Liquidacion   from '../pages/Liquidacion';
import Historico     from '../pages/Historico';
import Usuarios      from '../pages/Usuarios';
import Parametros    from '../pages/Parametros';

export default function AppRouter() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center',
      justifyContent:'center', background:'#F1F5F9', flexDirection:'column', gap:12 }}>
      <div style={{ width:36, height:36, border:'3px solid #E2E8F0',
        borderTopColor:'#2E5FA3', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
      <span style={{ fontSize:13, color:'#64748B' }}>Cargando...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/"      element={<Navigate to={user ? '/dashboard' : '/login'} />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard"   element={<ProtectedRoute module="dashboard">   <Dashboard />   </ProtectedRoute>} />
          <Route path="/carga"       element={<ProtectedRoute module="carga">       <CargaDatos />  </ProtectedRoute>} />
          <Route path="/liquidacion" element={<ProtectedRoute module="liquidacion"> <Liquidacion /> </ProtectedRoute>} />
          <Route path="/historico"   element={<ProtectedRoute module="historico">   <Historico />   </ProtectedRoute>} />
          <Route path="/usuarios"    element={<ProtectedRoute module="usuarios">    <Usuarios />    </ProtectedRoute>} />
          <Route path="/parametros"  element={<ProtectedRoute module="parametros">  <Parametros />  </ProtectedRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}