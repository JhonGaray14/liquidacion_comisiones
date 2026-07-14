import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES, NAV_ITEMS } from '../../data/roles';

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const allowed = ROLES[user?.rol]?.nav || [];
  const items   = NAV_ITEMS.filter(n => allowed.includes(n.id));

  const adminItems = items.filter(n => ['usuarios','parametros'].includes(n.id));
  const mainItems  = items.filter(n => !['usuarios','parametros'].includes(n.id));

  return (
    <aside style={styles.sidebar}>
      {/* Nav principal */}
      <div style={styles.section}>
        <div style={styles.sectionLabel}>Principal</div>
        {mainItems.map(item => (
          <SidebarItem key={item.id} item={item} active={location.pathname === item.path} />
        ))}
      </div>

      {/* Nav admin — solo si tiene acceso */}
      {adminItems.length > 0 && (
        <div style={{ ...styles.section, borderTop:'1px solid #E8EBF0', paddingTop:12 }}>
          <div style={styles.sectionLabel}>Administración</div>
          {adminItems.map(item => (
            <SidebarItem key={item.id} item={item} active={location.pathname === item.path} />
          ))}
        </div>
      )}

      {/* Footer del sidebar */}
      <div style={styles.footer}>
        <div style={styles.footerDot} />
        <div style={{ minWidth:0 }}>
          <div style={styles.footerName}>{user?.nombre}</div>
          {user?.canal && (
            <div style={styles.footerSub}>{user.canal} · {user.regional}</div>
          )}
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({ item, active }) {
  return (
    <NavLink to={item.path} style={{ textDecoration:'none' }}>
      <div style={{
        ...styles.navItem,
        ...(active ? styles.navItemActive : {}),
      }}>
        <span style={styles.navIcon}>{ICONS[item.icon]}</span>
        <span style={{ fontSize:13, color: active ? '#2E5FA3' : '#64748B' }}>{item.label}</span>
        {item.badge && (
          <span style={styles.badge}>{item.badge}</span>
        )}
      </div>
    </NavLink>
  );
}

const ICONS = {
  'bi-speedometer2': <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/><path d="M22 2 16 8"/></svg>,
  'bi-upload':       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  'bi-calculator':   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10"/><line x1="12" y1="10" x2="12" y2="10"/><line x1="16" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="12" y2="18"/></svg>,
  'bi-clock-history':<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  'bi-people':       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  'bi-sliders':      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>,
};

const styles = {
  sidebar:       { width:220, background:'#fff', borderRight:'1px solid #E8EBF0', display:'flex', flexDirection:'column', flexShrink:0, height:'calc(100vh - 56px)', position:'sticky', top:56, overflowY:'auto' },
  section:       { padding:'14px 0 6px' },
  sectionLabel:  { fontSize:10, fontWeight:600, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.07em', padding:'0 16px', marginBottom:4 },
  navItem:       { display:'flex', alignItems:'center', gap:10, padding:'9px 16px', cursor:'pointer', borderLeft:'3px solid transparent', transition:'all .12s', borderRadius:'0 6px 6px 0', margin:'1px 8px 1px 0' },
  navItemActive: { background:'#EEF3FB', borderLeftColor:'#f89520', borderRadius:'0 6px 6px 0' },
  navIcon:       { width:18, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'currentColor' },
  badge:         { marginLeft:'auto', background:'#FEF3C7', color:'#B45309', fontSize:10, fontWeight:600, padding:'1px 7px', borderRadius:10 },
  footer:        { marginTop:'auto', padding:'14px 16px', borderTop:'1px solid #E8EBF0', display:'flex', alignItems:'center', gap:10 },
  footerDot:     { width:8, height:8, borderRadius:'50%', background:'#22C55E', flexShrink:0 },
  footerName:    { fontSize:12, fontWeight:500, color:'#1E293B', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' },
  footerSub:     { fontSize:10, color:'#94A3B8', marginTop:1 },
};