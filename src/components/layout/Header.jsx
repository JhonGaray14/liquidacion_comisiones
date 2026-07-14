import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ROL_LABELS = {
  superadmin: 'Super Administrador',
  admin:      'Administrador',
  jefe:       'Jefe de canal',
  nomina:     'Nómina',
};

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const initials = user?.nombre
    ?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || '??';

  return (
    <header style={styles.header}>
      {/* Marca */}
      <div style={styles.brand}>
        <div style={styles.brandIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <div>
          <div style={styles.brandName}>Liquidación de comisiones</div>
          <div style={styles.brandSub}>Avícola El Madroño S.A.</div>
        </div>
      </div>

      {/* Derecha */}
      <div style={styles.right}>
        <div style={styles.periodo}>
          <span style={styles.periodoLabel}>Período activo</span>
          <span style={styles.periodoVal}>Mayo 2026</span>
        </div>

        <div style={styles.divider} />

        <div style={styles.userWrap}>
          <div style={styles.userInfo}>
            <div style={styles.userName}>{user?.nombre}</div>
            <div style={styles.userRol}>{ROL_LABELS[user?.rol]}</div>
          </div>
          <div style={styles.avatar}>{initials}</div>
        </div>

        <button onClick={handleLogout} style={styles.logoutBtn} title="Cerrar sesión">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </header>
  );
}

const styles = {
  header:      { height:56, background:'#f89520', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', flexShrink:0, position:'sticky', top:0, zIndex:100 },
  brand:       { display:'flex', alignItems:'center', gap:10 },
  brandIcon:   { width:34, height:34, background:'rgba(255,255,255,0.15)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  brandName:   { fontSize:14, fontWeight:600, color:'#fff', lineHeight:1.2 },
  brandSub:    { fontSize:10, color:'rgba(255,255,255,0.55)', marginTop:1 },
  right:       { display:'flex', alignItems:'center', gap:14 },
  periodo:     { display:'flex', flexDirection:'column', alignItems:'flex-end' },
  periodoLabel:{ fontSize:9,  color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.06em' },
  periodoVal:  { fontSize:12, color:'rgba(255,255,255,0.9)', fontWeight:500 },
  divider:     { width:1, height:28, background:'rgba(255,255,255,0.15)' },
  userWrap:    { display:'flex', alignItems:'center', gap:10 },
  userInfo:    { textAlign:'right' },
  userName:    { fontSize:13, color:'#fff', fontWeight:500, lineHeight:1.2 },
  userRol:     { fontSize:10, color:'rgba(255,255,255,0.55)' },
  avatar:      { width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,0.2)', border:'1.5px solid rgba(255,255,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:11, fontWeight:600 },
  logoutBtn:   { background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:7, color:'rgba(255,255,255,0.8)', cursor:'pointer', display:'flex', alignItems:'center', padding:'6px 8px', transition:'background .15s' },
};