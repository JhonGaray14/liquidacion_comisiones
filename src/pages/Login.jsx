import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const [form,     setForm]     = useState({ usuario: '', contrasena: '' });
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [show,     setShow]     = useState(false);

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.usuario.trim(), form.contrasena);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      <div style={S.card}>

        <div style={S.logoWrap}>
          <div style={S.logoIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <div>
            <div style={S.logoTitle}>Comisiones</div>
            <div style={S.logoSub}>Avícola El Madroño S.A.</div>
          </div>
        </div>

        <h1 style={S.h1}>Bienvenido</h1>
        <p  style={S.sub}>Ingresa tus credenciales para continuar</p>

        {error && (
          <div style={S.alert}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" style={{ flexShrink:0 }}>
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={S.field}>
            <label style={S.label}>Usuario</label>
            <input
              name="usuario"
              value={form.usuario}
              onChange={handleChange}
              placeholder="Tu usuario"
              required
              autoComplete="username"
              style={S.input}
            />
          </div>

          <div style={S.field}>
            <label style={S.label}>Contraseña</label>
            <div style={{ position:'relative' }}>
              <input
                name="contrasena"
                type={show ? 'text' : 'password'}
                value={form.contrasena}
                onChange={handleChange}
                placeholder="Tu contraseña"
                required
                autoComplete="current-password"
                style={{ ...S.input, paddingRight:42 }}
              />
              <button type="button" onClick={() => setShow(s => !s)} style={S.eyeBtn}>
                {show
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ ...S.btn, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>

        <a href="#!" style={S.forgot}>¿Olvidaste tu contraseña?</a>

      </div>
      <div style={S.footer}>Copyright © 2026 Avícola El Madroño S.A. — v1.0</div>
    </div>
  );
}

const C = {
  blue:'#f89520', blueMed:'#DC2626', blueLight:'#EEF3FB',
  border:'#E2E8F0', text:'#1E293B', muted:'#64748B',
  danger:'#DC2626', dangerBg:'#FEF2F2',
};

const S = {
  page:      { minHeight:'100vh', background:'#F1F5F9', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px' },
  card:      { background:'#fff', borderRadius:16, border:`1px solid ${C.border}`, padding:'36px 32px 28px', width:'100%', maxWidth:420, boxShadow:'0 4px 24px rgba(0,0,0,0.07)' },
  logoWrap:  { display:'flex', alignItems:'center', gap:12, marginBottom:28 },
  logoIcon:  { width:40, height:40, borderRadius:10, background:`linear-gradient(135deg,${C.blue},${C.blueMed})`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  logoTitle: { fontSize:15, fontWeight:600, color:C.text, lineHeight:1.2 },
  logoSub:   { fontSize:11, color:C.muted, marginTop:1 },
  h1:        { fontSize:22, fontWeight:700, color:C.blue, marginBottom:4 },
  sub:       { fontSize:13, color:C.muted, marginBottom:24 },
  alert:     { display:'flex', alignItems:'center', gap:8, background:C.dangerBg, border:`1px solid #FECACA`, color:C.danger, borderRadius:8, padding:'10px 12px', fontSize:13, marginBottom:16 },
  field:     { marginBottom:16 },
  label:     { display:'block', fontSize:11, fontWeight:600, color:C.muted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 },
  input:     { width:'100%', padding:'10px 12px', border:`1px solid ${C.border}`, borderRadius:8, fontSize:14, color:C.text, outline:'none', boxSizing:'border-box', fontFamily:'inherit', background:'#FAFAFA' },
  eyeBtn:    { position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex', alignItems:'center', padding:4 },
  btn:       { width:'100%', padding:'11px', background:`linear-gradient(135deg,${C.blue},${C.blueMed})`, color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer', marginTop:4, fontFamily:'inherit' },
  forgot:    { display:'block', textAlign:'center', marginTop:14, fontSize:13, color:C.blueMed, textDecoration:'none' },
  demoBox:   { marginTop:20, padding:'12px 14px', background:'#F8FAFC', borderRadius:8, border:`1px solid ${C.border}` },
  demoTitle: { fontSize:10, fontWeight:600, color:C.muted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 },
  demoRow:   { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 0', cursor:'pointer', borderBottom:`1px solid ${C.border}` },
  demoUser:  { fontSize:12, color:C.text, fontWeight:500 },
  demoRol:   { fontSize:10, color:C.blueMed, background:C.blueLight, padding:'2px 8px', borderRadius:10, fontWeight:500 },
  footer:    { marginTop:20, fontSize:11, color:C.muted },
};