import { useState } from 'react';

const FUENTES = [
  { id:'portafolio', titulo:'Portafolio de valores', sub:'Exportación ERP Siesa Enterprise', estado:'cargado',  fecha:'24 may', registros:12480, corregidos:34, errores:0 },
  { id:'pyg',        titulo:'PYG compañía',          sub:'Planeación — v2.1',               estado:'aprobado', fecha:'25 may', registros:null,  corregidos:null,errores:null },
  { id:'flex',       titulo:'Flex ventas diarias',   sub:'Consulta Siesa + ajustes',        estado:'pendiente',fecha:null,     registros:null,  corregidos:null,errores:null },
];

const AJUSTES = [
  { tipo:'Reasignación de canal',        cantidad:18, detalle:'Vendedores multicanal — margen tomado de portafolio' },
  { tipo:'Corrección de facturación',    cantidad:12, detalle:'Facturas con cliente mal asignado' },
  { tipo:'Sinergias Casablanca / Carneli',cantidad:4, detalle:'Presupuesto Liliana Santos aplicado' },
];

const ESTADO_CONFIG = {
  cargado:   { label:'Cargado',   color:'#16A34A', bg:'#F0FFF4', border:'#BBF7D0' },
  aprobado:  { label:'Aprobado',  color:'#16A34A', bg:'#F0FFF4', border:'#BBF7D0' },
  pendiente: { label:'Pendiente', color:'#D97706', bg:'#FFFBEB', border:'#FDE68A' },
};

const STEPS = ['Portafolio cargado','PYG aprobado','Flex ventas','Liquidación'];

export default function CargaDatos() {
  const [stepActivo] = useState(2);

  return (
    <div>
      <div style={S.pageHeader}>
        <div>
          <h4 style={S.pageTitle}>Carga de datos</h4>
          <p  style={S.pageSub}>Período activo: Mayo 2026 — Responsable: Auditoría</p>
        </div>
        <button style={S.btnPrimary}>↺ Reprocesar ETL</button>
      </div>

      {/* Stepper */}
      <div style={S.stepperWrap}>
        {STEPS.map((step, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', flex: i < STEPS.length-1 ? 1 : 0 }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
              <div style={{
                ...S.stepDot,
                background: i < stepActivo ? '#16A34A' : i === stepActivo ? '#2E5FA3' : '#E8EBF0',
                color:       i <= stepActivo ? '#fff' : '#94A3B8',
                borderColor: i < stepActivo ? '#16A34A' : i === stepActivo ? '#2E5FA3' : '#E8EBF0',
              }}>
                {i < stepActivo ? '✓' : i + 1}
              </div>
              <span style={{ fontSize:10, color: i <= stepActivo ? '#1E293B' : '#94A3B8', fontWeight: i === stepActivo ? 600 : 400, whiteSpace:'nowrap' }}>
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ ...S.stepLine, background: i < stepActivo ? '#16A34A' : '#E8EBF0', marginBottom:14 }} />
            )}
          </div>
        ))}
      </div>

      {/* Cards de fuentes */}
      <div style={S.uploadGrid}>
        {FUENTES.map(f => {
          const cfg = ESTADO_CONFIG[f.estado];
          const isPending = f.estado === 'pendiente';
          return (
            <div key={f.id} style={{ ...S.uploadCard, ...(isPending ? S.uploadCardActive : {}) }}>
              <UploadIcon active={isPending} />
              <div style={{ fontWeight:600, fontSize:13, color:'#1E293B', margin:'8px 0 2px' }}>{f.titulo}</div>
              <div style={{ fontSize:11, color:'#64748B', marginBottom:8 }}>{f.sub}</div>
              {f.fecha
                ? <span style={{ ...S.tag, background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}` }}>✓ {cfg.label} — {f.fecha}</span>
                : <span style={{ ...S.tag, background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}` }}>⏳ {cfg.label} de carga</span>
              }
              {isPending && (
                <button style={{ ...S.btnPrimary, marginTop:10, width:'100%', justifyContent:'center', display:'flex' }}>
                  Cargar archivo
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Resumen ETL */}
      <div style={S.card}>
        <div style={{ ...S.cardHeader }}>
          <span style={S.cardTitle}>ETL — Portafolio de valores</span>
          <span style={{ ...S.tag, background:'#F0FFF4', color:'#16A34A', border:'1px solid #BBF7D0' }}>✓ Procesado correctamente</span>
        </div>

        <div style={S.statRow}>
          {[
            { val:12480, label:'Registros procesados', color:'#16A34A', bg:'#F0FFF4' },
            { val:34,    label:'Registros corregidos', color:'#D97706', bg:'#FFFBEB' },
            { val:0,     label:'Errores',               color:'#DC2626', bg:'#FFF5F5' },
          ].map(s => (
            <div key={s.label} style={{ ...S.statCard, background:s.bg }}>
              <div style={{ fontSize:22, fontWeight:700, color:s.color }}>{s.val.toLocaleString()}</div>
              <div style={{ fontSize:11, color:s.color, marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <table style={S.table}>
          <thead>
            <tr>{['Tipo de ajuste','Cantidad','Detalle'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {AJUSTES.map((a,i) => (
              <tr key={i} style={{ background: i%2===0 ? '#FAFAFA' : '#fff' }}>
                <td style={S.td}><strong>{a.tipo}</strong></td>
                <td style={S.td}>{a.cantidad}</td>
                <td style={S.td}>{a.detalle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UploadIcon({ active }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke={active ? '#2E5FA3' : '#CBD5E1'} strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
}

const S = {
  pageHeader:      { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 },
  pageTitle:       { fontSize:20, fontWeight:700, color:'#1B3A6B', margin:0 },
  pageSub:         { fontSize:13, color:'#64748B', margin:'2px 0 0' },
  btnPrimary:      { padding:'8px 16px', background:'#2E5FA3', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' },
  stepperWrap:     { display:'flex', alignItems:'flex-start', marginBottom:24, background:'#fff', border:'1px solid #E8EBF0', borderRadius:12, padding:'16px 24px' },
  stepDot:         { width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:600, border:'2px solid', flexShrink:0 },
  stepLine:        { flex:1, height:2, margin:'0 8px' },
  uploadGrid:      { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 },
  uploadCard:      { background:'#fff', border:'1.5px dashed #CBD5E1', borderRadius:12, padding:20, textAlign:'center' },
  uploadCardActive:{ borderColor:'#2E5FA3', background:'#EEF3FB' },
  tag:             { display:'inline-block', padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:500 },
  card:            { background:'#fff', border:'1px solid #E8EBF0', borderRadius:12, padding:16, marginBottom:14 },
  cardHeader:      { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 },
  cardTitle:       { fontSize:13, fontWeight:600, color:'#1E293B' },
  statRow:         { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:14 },
  statCard:        { borderRadius:8, padding:'10px 14px', textAlign:'center' },
  table:           { width:'100%', borderCollapse:'collapse', fontSize:13 },
  th:              { background:'#F8FAFC', padding:'9px 12px', textAlign:'left', fontSize:11, fontWeight:600, color:'#64748B', textTransform:'uppercase', letterSpacing:'0.04em', borderBottom:'1px solid #E8EBF0' },
  td:              { padding:'10px 12px', borderBottom:'1px solid #F1F5F9', color:'#374151' },
};