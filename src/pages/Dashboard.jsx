// import { useAuth } from '../context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts';

const dataCumplimiento = [
  { canal: 'Food service', cumplimiento: 96 },
  { canal: 'Retail',       cumplimiento: 88 },
  { canal: 'Mayorista',    cumplimiento: 74 },
  { canal: 'Institucional',cumplimiento: 91 },
];

const dataRegional = [
  { regional: 'Santander',    cumplimiento: 98, meta: 90 },
  { regional: 'Bogotá',       cumplimiento: 85, meta: 90 },
  { regional: 'Costa',        cumplimiento: 79, meta: 90 },
  { regional: 'Eje cafetero', cumplimiento: 92, meta: 90 },
  { regional: 'Antioquia',    cumplimiento: 88, meta: 90 },
];

const ultimasLiquidaciones = [
  { vendedor: 'Juan Pérez',      canal: 'Food service', regional: 'Santander',    ventas: '$42.3M', cumplimiento: 103, comision: '$1.78M', estado: 'Aprobada' },
  { vendedor: 'María López',     canal: 'Retail',       regional: 'Bogotá',       ventas: '$38.1M', cumplimiento: 92,  comision: '$1.40M', estado: 'Aprobada' },
  { vendedor: 'Carlos Ruiz',     canal: 'Mayorista',    regional: 'Costa',        ventas: '$29.7M', cumplimiento: 74,  comision: '$0.90M', estado: 'Revisión' },
  { vendedor: 'Ana Torres',      canal: 'Food service', regional: 'Eje cafetero', ventas: '$35.4M', cumplimiento: 96,  comision: '$1.35M', estado: 'Pendiente' },
  { vendedor: 'Luis García',     canal: 'Institucional',regional: 'Antioquia',    ventas: '$44.2M', cumplimiento: 107, comision: '$2.10M', estado: 'Aprobada' },
];

const ESTADO_STYLE = {
  Aprobada:  { background:'#F0FFF4', color:'#166534', border:'1px solid #BBF7D0' },
  Revisión:  { background:'#FFFBEB', color:'#92400E', border:'1px solid #FDE68A' },
  Pendiente: { background:'#EFF6FF', color:'#1E40AF', border:'1px solid #BFDBFE' },
};

export default function Dashboard() {
  // const { user } = useAuth();

  return (
    <div>
      <div style={S.pageHeader}>
        <div>
          <h4 style={S.pageTitle}>Dashboard</h4>
          <p  style={S.pageSub}>Resumen ejecutivo — Mayo 2026</p>
        </div>
        <button style={S.btn}>
          <DownloadIcon /> Exportar
        </button>
      </div>

      {/* KPIs */}
      <div style={S.kpiGrid}>
        {[
          { label:'Ventas totales',        value:'$842M',  delta:'+8.3% vs meta',  up:true  },
          { label:'Cumplimiento PYG',      value:'94%',    delta:'Meta: 90%',       up:true  },
          { label:'Total comisiones',      value:'$38.4M', delta:'-2.1% vs mes ant',up:false },
          { label:'Vendedores liquidados', value:'47 / 52',delta:'5 pendientes',    up:null  },
        ].map(k => (
          <div key={k.label} style={S.kpiCard}>
            <div style={S.kpiLabel}>{k.label}</div>
            <div style={S.kpiVal}>{k.value}</div>
            <div style={{ ...S.kpiDelta, color: k.up === null ? '#D97706' : k.up ? '#16A34A' : '#DC2626' }}>
              {k.up === true && '↑ '}{k.up === false && '↓ '}{k.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Gráficas */}
      <div style={S.chartGrid}>
        <div style={S.card}>
          <div style={S.cardTitle}>Cumplimiento por canal (%)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dataCumplimiento} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="canal" tick={{ fontSize:11, fill:'#94A3B8' }} />
              <YAxis domain={[0,110]} tick={{ fontSize:11, fill:'#94A3B8' }} />
              <Tooltip formatter={v => [`${v}%`, 'Cumplimiento']} />
              <Bar dataKey="cumplimiento" fill="#2E5FA3" radius={[4,4,0,0]}
                label={{ position:'top', fontSize:11, fill:'#2E5FA3', formatter: v => `${v}%` }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={S.card}>
          <div style={S.cardTitle}>Cumplimiento por regional (%)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dataRegional}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="regional" tick={{ fontSize:10, fill:'#94A3B8' }} />
              <YAxis domain={[60,110]} tick={{ fontSize:11, fill:'#94A3B8' }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize:11 }} />
              <Line type="monotone" dataKey="cumplimiento" stroke="#2E5FA3" strokeWidth={2} dot={{ r:4 }} name="Cumplimiento" />
              <Line type="monotone" dataKey="meta"         stroke="#DC2626" strokeWidth={1.5} strokeDasharray="5 4" dot={false} name="Meta (90%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla */}
      <div style={S.card}>
        <div style={S.cardTitle}>Últimas liquidaciones procesadas</div>
        <div style={{ overflowX:'auto' }}>
          <table style={S.table}>
            <thead>
              <tr>{['Vendedor','Canal','Regional','Ventas','Cumpl.','Comisión','Estado']
                .map(h => <th key={h} style={S.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {ultimasLiquidaciones.map((r,i) => (
                <tr key={i} style={{ background: i%2===0 ? '#FAFAFA' : '#fff' }}>
                  <td style={S.td}><strong>{r.vendedor}</strong></td>
                  <td style={S.td}>{r.canal}</td>
                  <td style={S.td}>{r.regional}</td>
                  <td style={S.td}>{r.ventas}</td>
                  <td style={S.td}>
                    <span style={{ color: r.cumplimiento>=100?'#16A34A':r.cumplimiento>=90?'#D97706':'#DC2626', fontWeight:600 }}>
                      {r.cumplimiento}%
                    </span>
                  </td>
                  <td style={S.td}><strong>{r.comision}</strong></td>
                  <td style={S.td}>
                    <span style={{ ...S.tag, ...ESTADO_STYLE[r.estado] }}>{r.estado}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DownloadIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight:4 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
}

const S = {
  pageHeader: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 },
  pageTitle:  { fontSize:20, fontWeight:700, color:'#1B3A6B', margin:0 },
  pageSub:    { fontSize:13, color:'#64748B', margin:'2px 0 0' },
  btn:        { display:'flex', alignItems:'center', padding:'8px 16px', border:'1px solid #E2E8F0', borderRadius:8, background:'#fff', fontSize:13, cursor:'pointer', color:'#374151', fontFamily:'inherit' },
  kpiGrid:    { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 },
  kpiCard:    { background:'#fff', border:'1px solid #E8EBF0', borderRadius:12, padding:'14px 16px' },
  kpiLabel:   { fontSize:11, color:'#64748B', marginBottom:6, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em' },
  kpiVal:     { fontSize:24, fontWeight:700, color:'#1E293B', lineHeight:1 },
  kpiDelta:   { fontSize:11, marginTop:5 },
  chartGrid:  { display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 },
  card:       { background:'#fff', border:'1px solid #E8EBF0', borderRadius:12, padding:16, marginBottom:14 },
  cardTitle:  { fontSize:13, fontWeight:600, color:'#1E293B', marginBottom:14 },
  table:      { width:'100%', borderCollapse:'collapse', fontSize:13 },
  th:         { background:'#F8FAFC', padding:'9px 12px', textAlign:'left', fontSize:11, fontWeight:600, color:'#64748B', textTransform:'uppercase', letterSpacing:'0.04em', borderBottom:'1px solid #E8EBF0' },
  td:         { padding:'10px 12px', borderBottom:'1px solid #F1F5F9', color:'#374151' },
  tag:        { display:'inline-block', padding:'2px 10px', borderRadius:20, fontSize:11, fontWeight:500 },
};