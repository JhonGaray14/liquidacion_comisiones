import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getUsuarios, crearUsuario, actualizarUsuario,
  toggleEstadoUsuario, getCatalogos
} from '../services/api';

const ROL_OPTS   = ['superadmin','admin','jefe','nomina','vendedor'];
const ROL_LABELS = { superadmin:'Super admin', admin:'Administrador', jefe:'Jefe canal', nomina:'Nómina', vendedor:'Vendedor' };
const ROL_STYLE  = {
  superadmin:{ bg:'#EFF6FF', color:'#1E40AF', border:'#BFDBFE' },
  admin:     { bg:'#FFFBEB', color:'#92400E', border:'#FDE68A' },
  jefe:      { bg:'#F5F3FF', color:'#5B21B6', border:'#DDD6FE' },
  nomina:    { bg:'#F0FDF4', color:'#166534', border:'#BBF7D0' },
  vendedor:  { bg:'#F8FAFC', color:'#475569', border:'#E2E8F0' },
};

const PERMISOS = [
  { modulo:'Dashboard',              superadmin:true,  admin:true,  jefe:true,  nomina:true  },
  { modulo:'Carga de datos',         superadmin:true,  admin:true,  jefe:false, nomina:false },
  { modulo:'Liquidación (su canal)', superadmin:true,  admin:true,  jefe:true,  nomina:true  },
  { modulo:'Liquidación (todos)',    superadmin:true,  admin:true,  jefe:false, nomina:false },
  { modulo:'Gestión de usuarios',    superadmin:true,  admin:false, jefe:false, nomina:false },
  { modulo:'Parámetros',             superadmin:true,  admin:false, jefe:false, nomina:false },
  { modulo:'Histórico',              superadmin:true,  admin:true,  jefe:true,  nomina:true  },
];

const FORM_INIT = { nombre:'', correo:'', usuario:'', contrasena:'', rol:'vendedor', codvend:'', id_canal:'', id_regional:'', estado:'activo' };

export default function Usuarios() {
  const { token, user } = useAuth();

  const [usuarios,   setUsuarios]   = useState([]);
  const [catalogos,  setCatalogos]  = useState({ canales:[], regionales:[] });
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [showModal,  setShowModal]  = useState(false);
  const [editando,   setEditando]   = useState(null);
  const [form,       setForm]       = useState(FORM_INIT);
  const [saving,     setSaving]     = useState(false);
  const [formError,  setFormError]  = useState('');

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const [lista, cats] = await Promise.all([
        getUsuarios(token),
        getCatalogos(token),
      ]);
      setUsuarios(lista);
      setCatalogos(cats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { cargar(); }, [cargar]);

  const abrirCrear = () => {
    setEditando(null);
    setForm(FORM_INIT);
    setFormError('');
    setShowModal(true);
  };

  const abrirEditar = (u) => {
    setEditando(u);
    setForm({
      nombre:      u.nombre,
      correo:      u.correo,
      usuario:     u.usuario,
      contrasena:  '',
      rol:         u.rol,
      codvend:     u.codvend    || '',
      id_canal:    u.id_canal    || '',
      id_regional: u.id_regional || '',
      estado:      u.estado,
    });
    setFormError('');
    setShowModal(true);
  };

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleGuardar = async e => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const payload = {
        ...form,
        id_canal:    form.id_canal    || null,
        id_regional: form.id_regional || null,
      };
      if (!payload.contrasena) delete payload.contrasena;

      if (editando) {
        await actualizarUsuario(token, editando.id, payload);
      } else {
        await crearUsuario(token, payload);
      }
      setShowModal(false);
      await cargar();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (u) => {
    const nuevoEstado = u.estado === 'activo' ? 'inactivo' : 'activo';
    try {
      await toggleEstadoUsuario(token, u.id, nuevoEstado);
      await cargar();
    } catch (err) {
      alert(err.message);
    }
  };

  const esJefe = user?.rol === 'jefe';

  return (
    <div>
      <div style={S.pageHeader}>
        <div>
          <h4 style={S.pageTitle}>
            {esJefe ? 'Mis vendedores' : 'Gestión de usuarios'}
          </h4>
          <p style={S.pageSub}>
            {loading ? 'Cargando...' : `${usuarios.filter(u=>u.estado==='activo').length} activos de ${usuarios.length}`}
          </p>
        </div>
        <button style={S.btnPrimary} onClick={abrirCrear}>
          + {esJefe ? 'Nuevo vendedor' : 'Nuevo usuario'}
        </button>
      </div>

      {error && <div style={S.alertBox}>{error}</div>}

      {/* Tabla usuarios */}
      <div style={S.card}>
        {loading ? (
          <div style={S.loadingBox}>Cargando usuarios...</div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={S.table}>
              <thead>
                <tr>
                  {['Nombre','Correo','Rol','Cod. Vendedor','Canal','Regional',
                    esJefe ? 'Estado' : 'Jefe asignado','Estado','Acciones']
                    .filter((h,i) => !(esJefe && i === 6))
                    .map(h => <th key={h} style={S.th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr><td colSpan={8} style={{ ...S.td, textAlign:'center', color:'#94A3B8', padding:24 }}>
                    {esJefe ? 'Aún no tienes vendedores asignados. Crea el primero.' : 'No hay usuarios registrados.'}
                  </td></tr>
                ) : usuarios.map((u, i) => {
                  const rs = ROL_STYLE[u.rol] || ROL_STYLE.vendedor;
                  return (
                    <tr key={u.id} style={{ background: i%2===0 ? '#FAFAFA':'#fff' }}>
                      <td style={S.td}><strong>{u.nombre}</strong></td>
                      <td style={{ ...S.td, color:'#64748B' }}>{u.correo}</td>
                      <td style={S.td}>
                        <span style={{ display:'inline-block', padding:'2px 10px', borderRadius:20,
                          fontSize:11, fontWeight:600, background:rs.bg, color:rs.color, border:`1px solid ${rs.border}` }}>
                          {ROL_LABELS[u.rol] || u.rol}
                        </span>
                      </td>
                      <td style={S.td}>
                        {u.codvend
                          ? <span style={{ fontFamily:'monospace', fontSize:12, background:'#F1F5F9',
                              padding:'2px 8px', borderRadius:5, color:'#475569' }}>{u.codvend}</span>
                          : <span style={{ color:'#CBD5E1' }}>—</span>}
                      </td>
                      <td style={S.td}>{u.canal    || '—'}</td>
                      <td style={S.td}>{u.regional || '—'}</td>
                      {!esJefe && <td style={S.td}>{u.nombre_jefe || '—'}</td>}
                      <td style={S.td}>
                        <span style={{ display:'inline-block', padding:'2px 10px', borderRadius:20, fontSize:11, fontWeight:500,
                          background: u.estado==='activo' ? '#F0FFF4':'#F8FAFC',
                          color:      u.estado==='activo' ? '#166534':'#94A3B8',
                          border:    `1px solid ${u.estado==='activo' ? '#BBF7D0':'#E2E8F0'}` }}>
                          {u.estado === 'activo' ? '● Activo' : '○ Inactivo'}
                        </span>
                      </td>
                      <td style={S.td}>
                        <div style={{ display:'flex', gap:6 }}>
                          <button style={S.iconBtn} onClick={() => abrirEditar(u)} title="Editar">✏</button>
                          <button
                            style={{ ...S.iconBtn, color: u.estado==='activo' ? '#DC2626':'#16A34A' }}
                            onClick={() => handleToggle(u)}
                            title={u.estado==='activo' ? 'Inactivar':'Activar'}>
                            {u.estado === 'activo' ? '⊘' : '✓'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Matriz de permisos — solo para admin/superadmin */}
      {!esJefe && (
        <div style={S.card}>
          <div style={S.cardTitle}>Matriz de permisos por rol</div>
          <div style={{ overflowX:'auto' }}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Módulo</th>
                  {['Super admin','Admin','Jefe canal','Nómina'].map(r =>
                    <th key={r} style={{ ...S.th, textAlign:'center' }}>{r}</th>)}
                </tr>
              </thead>
              <tbody>
                {PERMISOS.map((p,i) => (
                  <tr key={i} style={{ background: i%2===0 ? '#FAFAFA':'#fff' }}>
                    <td style={S.td}>{p.modulo}</td>
                    {[p.superadmin, p.admin, p.jefe, p.nomina].map((tiene, ci) => (
                      <td key={ci} style={{ ...S.td, textAlign:'center' }}>
                        {tiene
                          ? <span style={{ color:'#16A34A', fontSize:16 }}>✓</span>
                          : <span style={{ color:'#CBD5E1', fontSize:16 }}>✕</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div style={S.overlay} onClick={() => setShowModal(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={S.modalHeader}>
              <span style={S.modalTitle}>
                {editando
                  ? `Editar — ${editando.nombre}`
                  : esJefe ? 'Nuevo vendedor' : 'Nuevo usuario'}
              </span>
              <button style={S.closeBtn} onClick={() => setShowModal(false)}>✕</button>
            </div>

            {formError && <div style={S.alertBox}>{formError}</div>}

            <form onSubmit={handleGuardar}>
              <div style={S.formGrid}>
                <div style={S.formGroup}>
                  <label style={S.label}>Nombre completo *</label>
                  <input name="nombre" value={form.nombre} onChange={handleChange}
                    required style={S.input} placeholder="Ej: Juan Pérez" />
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Correo electrónico *</label>
                  <input name="correo" type="email" value={form.correo} onChange={handleChange}
                    required style={S.input} placeholder="correo@empresa.com" />
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Usuario *</label>
                  <input name="usuario" value={form.usuario} onChange={handleChange}
                    required style={S.input} placeholder="usuario_login"
                    disabled={!!editando} />
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>{editando ? 'Nueva contraseña (opcional)' : 'Contraseña *'}</label>
                  <input name="contrasena" type="password" value={form.contrasena}
                    onChange={handleChange} required={!editando}
                    style={S.input} placeholder="Mínimo 6 caracteres" />
                </div>

                {/* Rol solo visible para admin/superadmin */}
                {!esJefe && (
                  <div style={S.formGroup}>
                    <label style={S.label}>Rol *</label>
                    <select name="rol" value={form.rol} onChange={handleChange} style={S.input}>
                      {ROL_OPTS.map(r => <option key={r} value={r}>{ROL_LABELS[r]}</option>)}
                    </select>
                  </div>
                )}

                <div style={S.formGroup}>
                  <label style={S.label}>Código vendedor</label>
                  <input
                    name="codvend"
                    value={form.codvend}
                    onChange={handleChange}
                    style={S.input}
                    placeholder="Ej: VD-001"
                  />
                </div>

                {/* Canal — fijo para jefe (usa el suyo), editable para admin */}
                {esJefe ? (
                  <div style={S.formGroup}>
                    <label style={S.label}>Canal</label>
                    <input value={user.canal || '—'} disabled style={{ ...S.input, background:'#F1F5F9', color:'#94A3B8' }} />
                    <span style={{ fontSize:10, color:'#94A3B8' }}>Se asigna automáticamente desde tu perfil</span>
                  </div>
                ) : (
                  <div style={S.formGroup}>
                    <label style={S.label}>Canal</label>
                    <select name="id_canal" value={form.id_canal} onChange={handleChange} style={S.input}>
                      <option value="">Sin canal</option>
                      {catalogos.canales.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                  </div>
                )}

                {/* Regional — fija para jefe */}
                {esJefe ? (
                  <div style={S.formGroup}>
                    <label style={S.label}>Regional</label>
                    <input value={user.regional || '—'} disabled style={{ ...S.input, background:'#F1F5F9', color:'#94A3B8' }} />
                    <span style={{ fontSize:10, color:'#94A3B8' }}>Se asigna automáticamente desde tu perfil</span>
                  </div>
                ) : (
                  <div style={S.formGroup}>
                    <label style={S.label}>Regional</label>
                    <select name="id_regional" value={form.id_regional} onChange={handleChange} style={S.input}>
                      <option value="">Sin regional</option>
                      {catalogos.regionales.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                    </select>
                  </div>
                )}

                {editando && (
                  <div style={S.formGroup}>
                    <label style={S.label}>Estado</label>
                    <select name="estado" value={form.estado} onChange={handleChange} style={S.input}>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>
                )}
              </div>

              <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:20 }}>
                <button type="button" style={S.btn} onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" style={S.btnPrimary} disabled={saving}>
                  {saving ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  pageHeader:  { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 },
  pageTitle:   { fontSize:20, fontWeight:700, color:'#1B3A6B', margin:0 },
  pageSub:     { fontSize:13, color:'#64748B', margin:'2px 0 0' },
  btn:         { padding:'8px 16px', border:'1px solid #E2E8F0', borderRadius:8, background:'#fff', fontSize:13, cursor:'pointer', color:'#374151', fontFamily:'inherit' },
  btnPrimary:  { padding:'8px 16px', background:'#2E5FA3', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' },
  card:        { background:'#fff', border:'1px solid #E8EBF0', borderRadius:12, padding:16, marginBottom:14 },
  cardTitle:   { fontSize:13, fontWeight:600, color:'#1E293B', marginBottom:12 },
  alertBox:    { background:'#FEF2F2', border:'1px solid #FECACA', color:'#DC2626', borderRadius:8, padding:'10px 14px', fontSize:13, marginBottom:14 },
  loadingBox:  { textAlign:'center', padding:32, color:'#94A3B8', fontSize:13 },
  table:       { width:'100%', borderCollapse:'collapse', fontSize:13 },
  th:          { background:'#F8FAFC', padding:'9px 12px', textAlign:'left', fontSize:11, fontWeight:600, color:'#64748B', textTransform:'uppercase', letterSpacing:'0.04em', borderBottom:'1px solid #E8EBF0', whiteSpace:'nowrap' },
  td:          { padding:'10px 12px', borderBottom:'1px solid #F1F5F9', color:'#374151' },
  iconBtn:     { padding:'4px 8px', border:'1px solid #E2E8F0', borderRadius:6, background:'#fff', fontSize:13, cursor:'pointer', color:'#64748B' },
  overlay:     { position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 },
  modal:       { background:'#fff', borderRadius:16, padding:28, width:'100%', maxWidth:580, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' },
  modalHeader: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 },
  modalTitle:  { fontSize:16, fontWeight:700, color:'#1B3A6B' },
  closeBtn:    { background:'none', border:'none', fontSize:18, cursor:'pointer', color:'#94A3B8', lineHeight:1 },
  formGrid:    { display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 },
  formGroup:   { display:'flex', flexDirection:'column' },
  label:       { fontSize:11, fontWeight:600, color:'#64748B', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:5 },
  input:       { padding:'9px 10px', border:'1px solid #E2E8F0', borderRadius:8, fontSize:13, color:'#374151', background:'#FAFAFA', fontFamily:'inherit', outline:'none' },
};