import { useState } from 'react';

const HISTORIAL = [
  { periodo:'Abril 2026',    canal:'Food service', regional:'Santander',    vendedores:4, ventas:'$176.3M', comisiones:'$6.8M',  estado:'Cerrado' },
  { periodo:'Marzo 2026',    canal:'Food service', regional:'Santander',    vendedores:4, ventas:'$168.9M', comisiones:'$6.4M',  estado:'Cerrado' },
  { periodo:'Febrero 2026',  canal:'Food service', regional:'Santander',    vendedores:4, ventas:'$154.2M', comisiones:'$5.9M',  estado:'Cerrado' },
  { periodo:'Enero 2026',    canal:'Retail',       regional:'Bogotá',       vendedores:6, ventas:'$192.1M', comisiones:'$7.4M',  estado:'Cerrado' },
  { periodo:'Diciembre 2025',canal:'Mayorista',    regional:'Costa',        vendedores:3, ventas:'$140.5M', comisiones:'$4.9M',  estado:'Cerrado' },
  { periodo:'Noviembre 2025',canal:'Institucional',regional:'Antioquia',    vendedores:5, ventas:'$183.7M', comisiones:'$6.1M',  estado:'Cerrado' },
];

export default function Historico() {
  const [canal,  setCanal]  = useState('Todos');
  const [año,    setAño]    = useState('Todos');

  const filtrados = HISTORIAL.filter(h =>
    (canal === 'Todos' || h.canal === canal) &&
    (año   === 'Todos' || h.periodo.includes(año))
  );

  return (
    <div>
      <div style={S.pageHeader}>
        <div>
          <h4 style={S.pageTitle}>Histórico de liquidaciones</h4>
          <p  style={S.pageSub}>Consulta y descarga de períodos cerrados</p>
        </div>
      </div>

      <div style={S.card}>
        <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
          <select value={canal} onChange={e => setCanal(e.target.value)} style={S.select}>
            {['Todos','Food service','Retail','Mayorista','Institucional'].map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={año} onChange={e => setAño(e.target.value)} style={S.select}>
            {['Todos','2026','2025'].map(a => <option key={a}>{a}</option>)}
          </select>
          <button style={S.btn}>🔍 Filtrar</button>
        </div>

        <div style={{ overflowX:'auto' }}>
          <table style={S.table}>
            <thead>
              <tr>{['Período','Canal','Regional','Vendedores','Total ventas','Total comisiones','Estado','Descargar']
                .map(h => <th key={h} style={S.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((r,i) => (
                <tr key={i} style={{ background: i%2===0 ? '#FAFAFA' : '#fff' }}>
                  <td style={S.td}><strong>{r.periodo}</strong></td>
                  <td style={S.td}>{r.canal}</td>
                  <td style={S.td}>{r.regional}</td>
                  <td style={{ ...S.td, textAlign:'center' }}>{r.vendedores}</td>
                  <td style={S.td}>{r.ventas}</td>
                  <td style={S.td}><strong>{r.comisiones}</strong></td>
                  <td style={S.td}>
                    <span style={{ display:'inline-block', padding:'2px 10px', borderRadius:20, fontSize:11, fontWeight:500, background:'#F0FFF4', color:'#166534', border:'1px solid #BBF7D0' }}>
                      ✓ {r.estado}
                    </span>
                  </td>
                  <td style={S.td}>
                    <div style={{ display:'flex', gap:6 }}>
                      <button style={S.dlBtn}>⬇ Excel</button>
                      <button style={S.dlBtn}>⬇ PDF</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr><td colSpan={8} style={{ ...S.td, textAlign:'center', color:'#94A3B8', padding:24 }}>
                  Sin resultados para los filtros seleccionados.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const S = {
  pageHeader: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 },
  pageTitle:  { fontSize:20, fontWeight:700, color:'#1B3A6B', margin:0 },
  pageSub:    { fontSize:13, color:'#64748B', margin:'2px 0 0' },
  btn:        { padding:'7px 14px', border:'1px solid #E2E8F0', borderRadius:8, background:'#fff', fontSize:13, cursor:'pointer', color:'#374151', fontFamily:'inherit' },
  select:     { padding:'7px 10px', border:'1px solid #E2E8F0', borderRadius:8, fontSize:13, color:'#374151', background:'#fff', fontFamily:'inherit', cursor:'pointer' },
  card:       { background:'#fff', border:'1px solid #E8EBF0', borderRadius:12, padding:16 },
  table:      { width:'100%', borderCollapse:'collapse', fontSize:13 },
  th:         { background:'#F8FAFC', padding:'9px 12px', textAlign:'left', fontSize:11, fontWeight:600, color:'#64748B', textTransform:'uppercase', letterSpacing:'0.04em', borderBottom:'1px solid #E8EBF0', whiteSpace:'nowrap' },
  td:         { padding:'10px 12px', borderBottom:'1px solid #F1F5F9', color:'#374151', whiteSpace:'nowrap' },
  dlBtn:      { padding:'4px 10px', border:'1px solid #E2E8F0', borderRadius:6, background:'#fff', fontSize:11, cursor:'pointer', color:'#374151', fontFamily:'inherit' },
};