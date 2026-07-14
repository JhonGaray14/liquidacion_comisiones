import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const VENDEDORES = [
  { nombre:'Juan Pérez',    multicanal:false, venta:42.3, presupuesto:41.0, margen:29.2, base:42.3, pct:4.2, estado:'Aprobada' },
  { nombre:'Ana Torres',    multicanal:false, venta:35.4, presupuesto:36.8, margen:28.4, base:35.4, pct:3.8, estado:'Revisión' },
  { nombre:'Pedro Cárdenas',multicanal:false, venta:28.1, presupuesto:31.0, margen:27.1, base:28.1, pct:null, estado:'Sin bono' },
  { nombre:'Sandra Mora',   multicanal:true,  venta:51.6, presupuesto:48.0, margen:28.9, base:51.6, pct:4.8, estado:'Aprobada' },
];

const RANGOS = [
  { rango:'Sin comisión', desde:0,   hasta:90,  pct:null },
  { rango:'Base',         desde:90,  hasta:95,  pct:3.2  },
  { rango:'Estándar',     desde:95,  hasta:100, pct:3.8  },
  { rango:'Excelencia',   desde:100, hasta:105, pct:4.2  },
  { rango:'Sobre cuota',  desde:105, hasta:999, pct:4.8  },
];

const ESTADO_S = {
  Aprobada: { bg:'#F0FFF4', color:'#166534', border:'#BBF7D0' },
  Revisión: { bg:'#FFFBEB', color:'#92400E', border:'#FDE68A' },
  'Sin bono':{ bg:'#F8FAFC', color:'#475569', border:'#E2E8F0' },
};

export default function Liquidacion() {
  const { user } = useAuth();
  const [canal,    setCanal]    = useState('Food service');
  const [regional, setRegional] = useState('Santander');
  const [periodo,  setPeriodo]  = useState('Mayo 2026');

  const cumpl = v => Math.round((v.venta / v.presupuesto) * 100);
  const comision = v => v.pct ? (v.base * v.pct / 100).toFixed(2) : '—';

  return (
    <div>
      <div style={S.pageHeader}>
        <div>
          <h4 style={S.pageTitle}>Liquidación por canal</h4>
          <p  style={S.pageSub}>
            {user.rol === 'jefe'
              ? `Canal: ${user.canal} · Regional: ${user.regional}`
              : 'Vista de todos los canales'}
          </p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button style={S.btn}>⬇ PDF</button>
          <button style={S.btnPrimary}>⬇ Excel</button>
        </div>
      </div>

      {/* Filtros */}
      <div style={S.card}>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
          {user.rol !== 'jefe' && (
            <select value={canal} onChange={e => setCanal(e.target.value)} style={S.select}>
              {['Food service','Retail','Mayorista','Institucional'].map(c => <option key={c}>{c}</option>)}
            </select>
          )}
          <select value={regional} onChange={e => setRegional(e.target.value)} style={S.select}>
            {['Santander','Bogotá','Costa','Eje cafetero','Antioquia'].map(r => <option key={r}>{r}</option>)}
          </select>
          <select value={periodo} onChange={e => setPeriodo(e.target.value)} style={S.select}>
            {['Mayo 2026','Abril 2026','Marzo 2026'].map(p => <option key={p}>{p}</option>)}
          </select>
        </div>

        {/* KPIs rápidos */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:16 }}>
          {[
            { label:'Venta canal',     val:'$184.2M', delta:'96% vs meta', up:true  },
            { label:'Margen PYG',      val:'28.4%',   delta:'Meta: 27%',   up:true  },
            { label:'Clientes nuevos', val:'12',       delta:'Meta: 8',     up:true  },
          ].map(k => (
            <div key={k.label} style={S.kpiCard}>
              <div style={S.kpiLabel}>{k.label}</div>
              <div style={S.kpiVal}>{k.val}</div>
              <div style={{ fontSize:11, color:'#16A34A', marginTop:4 }}>↑ {k.delta}</div>
            </div>
          ))}
        </div>

        {/* Tabla vendedores */}
        <div style={{ overflowX:'auto' }}>
          <table style={S.table}>
            <thead>
              <tr>
                {['Vendedor','Venta real','Presupuesto','Cumplimiento','Margen','Base comisional','% Comisión','Valor comisión','Estado']
                  .map(h => <th key={h} style={S.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {VENDEDORES.map((v,i) => {
                const c = cumpl(v);
                const com = comision(v);
                return (
                  <tr key={i} style={{ background: i%2===0 ? '#FAFAFA' : '#fff' }}>
                    <td style={S.td}>
                      <strong>{v.nombre}</strong>
                      {v.multicanal && <span style={S.multicanalBadge}>multicanal</span>}
                    </td>
                    <td style={S.td}>${v.venta}M</td>
                    <td style={S.td}>${v.presupuesto}M</td>
                    <td style={S.td}>
                      <span style={{ fontWeight:700, color: c>=100?'#16A34A':c>=90?'#D97706':'#DC2626' }}>
                        {c}%
                      </span>
                    </td>
                    <td style={S.td}>{v.margen}%</td>
                    <td style={S.td}>
                      ${v.base}M {v.multicanal && <span style={{ fontSize:10, color:'#94A3B8' }}>*portafolio</span>}
                    </td>
                    <td style={S.td}>{v.pct ? `${v.pct}%` : '—'}</td>
                    <td style={S.td}><strong>{com !== '—' ? `$${com}M` : '—'}</strong></td>
                    <td style={S.td}>
                      <span style={{ ...S.tag, ...(ESTADO_S[v.estado] || {}) }}>{v.estado}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize:11, color:'#94A3B8', marginTop:8 }}>
          * Vendedor multicanal: margen tomado de ventas acumuladas del portafolio de valores.
        </p>
      </div>

      {/* Tabla de rangos */}
      <div style={S.card}>
        <div style={S.cardTitle}>Rangos de cumplimiento — {canal}</div>
        <table style={S.table}>
          <thead>
            <tr>{['Rango','Cumplimiento desde','Hasta','% Comisión','Aplica bono']
              .map(h => <th key={h} style={S.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {RANGOS.map((r,i) => (
              <tr key={i} style={{ background: i%2===0 ? '#FAFAFA' : '#fff' }}>
                <td style={S.td}><strong>{r.rango}</strong></td>
                <td style={S.td}>{r.desde}%</td>
                <td style={S.td}>{r.hasta === 999 ? '∞' : `${r.hasta}%`}</td>
                <td style={S.td}>{r.pct ? `${r.pct}%` : '—'}</td>
                <td style={S.td}>
                  <span style={{ ...S.tag, ...(r.pct
                    ? { bg:'#F0FFF4', color:'#166534', border:'1px solid #BBF7D0', background:'#F0FFF4' }
                    : { bg:'#FFF5F5', color:'#991B1B', border:'1px solid #FECACA', background:'#FFF5F5' }
                  )}}>
                    {r.pct ? 'Sí' : 'No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const S = {
  pageHeader:      { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 },
  pageTitle:       { fontSize:20, fontWeight:700, color:'#1B3A6B', margin:0 },
  pageSub:         { fontSize:13, color:'#64748B', margin:'2px 0 0' },
  btn:             { padding:'8px 14px', border:'1px solid #E2E8F0', borderRadius:8, background:'#fff', fontSize:13, cursor:'pointer', color:'#374151', fontFamily:'inherit' },
  btnPrimary:      { padding:'8px 16px', background:'#2E5FA3', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' },
  select:          { padding:'7px 10px', border:'1px solid #E2E8F0', borderRadius:8, fontSize:13, color:'#374151', background:'#fff', fontFamily:'inherit', cursor:'pointer' },
  card:            { background:'#fff', border:'1px solid #E8EBF0', borderRadius:12, padding:16, marginBottom:14 },
  cardTitle:       { fontSize:13, fontWeight:600, color:'#1E293B', marginBottom:12 },
  kpiCard:         { background:'#F8FAFC', border:'1px solid #E8EBF0', borderRadius:10, padding:'12px 14px' },
  kpiLabel:        { fontSize:11, color:'#64748B', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em' },
  kpiVal:          { fontSize:22, fontWeight:700, color:'#1E293B', lineHeight:1.2, marginTop:4 },
  table:           { width:'100%', borderCollapse:'collapse', fontSize:13 },
  th:              { background:'#F8FAFC', padding:'9px 12px', textAlign:'left', fontSize:11, fontWeight:600, color:'#64748B', textTransform:'uppercase', letterSpacing:'0.04em', borderBottom:'1px solid #E8EBF0', whiteSpace:'nowrap' },
  td:              { padding:'10px 12px', borderBottom:'1px solid #F1F5F9', color:'#374151', whiteSpace:'nowrap' },
  tag:             { display:'inline-block', padding:'2px 10px', borderRadius:20, fontSize:11, fontWeight:500, border:'1px solid transparent' },
  multicanalBadge: { marginLeft:6, fontSize:10, color:'#64748B', background:'#F1F5F9', padding:'1px 6px', borderRadius:8, fontWeight:400 },
};