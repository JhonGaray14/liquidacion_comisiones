import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Header  from './Header';

export default function MainLayout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
      <Header />
      <div style={{ display:'flex', flex:1 }}>
        <Sidebar />
        <main style={{ flex:1, padding:'24px', background:'#F5F6FA', overflowY:'auto', minHeight:'calc(100vh - 56px)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}