import { useState } from 'react';

const RANGOS_INIT = [
  { rango:'Sin comisión', desde:0,   hasta:90,  pct:0   },
  { rango:'Base',         desde:90,  hasta:95,  pct:3.2 },
  { rango:'Estándar',     desde:95,  hasta:100, pct:3.8 },
  { rango:'Excelencia',   desde:100, hasta:105, pct:4.2 },
  { rango:'Sobre cuota',  desde:105, hasta:999, pct:4.8 },
];

export default function Parametros() {
  const [rangos, setRangos] = useState(RANGOS_INIT);
  const [saved,  setSaved]  = useState(false);

  const updateRango = (i, field, val) =>
    setRangos(r => r.map((row, ri) => ri === i ? { ...row, [field]: val } : row));

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div>
      <div style={S.pageHeader}>
        <div>
          <h4 style={S.pageTitle}>Configuración de parámetros</h4>
          <p  style={S.pageSub}>Rangos, porcentajes de comisión y metas por canal</p>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {saved && <span style={{ fontSize:12, color:'#16A34A', fontWeight:500 }}>✓ Guardado correctamente</span>}
          <button style={S.btnPrimary} onClick={handleSave}>💾 Guardar cambios</button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {/* Parámetros generales */}
        <div style={S.card}>
          <div style={S.cardTitle}>Parámetros generales</div>

          <div style={S.sectionTitle}>Período activo</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
            <div>
              <label style={S.label}>Mes</label>
              <select style={S.input}>
                {['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
                  .map(m => <option key={m} selected={m==='Mayo'}>{m}</option>)}
              </select>
            </div>
            <div>
              <label style={S.label}>Año</label>
              <select style={S.input}><option>2026</option><option>2025</option></select>
            </div>
          </div>

          <div style={S.sectionTitle}>Indicadores adicionales</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[
              { label:'Meta clientes nuevos', val:8,  type:'number' },
              { label:'Peso en comisión (%)', val:5,  type:'number' },
              { label:'Margen mínimo PYG (%)',val:27, type:'number' },
            ].map(f => (
              <div key={f.label}>
                <label style={S.label}>{f.label}</label>
                <input defaultValue={f.val} type={f.type} style={S.input} />
              </div>
            ))}
            <div>
              <label style={S.label}>Canal activo</label>
              <select style={S.input}>
                {['Food service','Retail','Mayorista','Institucional'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Rangos */}
        <div style={S.card}>
          <div style={S.cardTitle}>Rangos de cumplimiento — Food service</div>
          <table style={S.table}>
            <thead>
              <tr>{['Rango','Desde (%)','Hasta (%)','% Comisión'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {rangos.map((r,i) => (
                <tr key={i}>
                  <td style={S.td}>{r.rango}</td>
                  <td style={S.td}><input value={r.desde} onChange={e => updateRango(i,'desde',e.target.value)} style={S.cellInput} /></td>
                  <td style={S.td}><input value={r.hasta === 999 ? '∞' : r.hasta} onChange={e => updateRango(i,'hasta',e.target.value)} style={S.cellInput} /></td>
                  <td style={S.td}><input value={r.pct} onChange={e => updateRango(i,'pct',e.target.value)} style={S.cellInput} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button style={{ ...S.btn, marginTop:10, fontSize:12 }}
            onClick={() => setRangos(r => [...r, { rango:'Nuevo rango', desde:0, hasta:0, pct:0 }])}>
            + Agregar rango
          </button>
        </div>
      </div>
    </div>
  );
}

const S = {
  pageHeader:  { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 },
  pageTitle:   { fontSize:20, fontWeight:700, color:'#1B3A6B', margin:0 },
  pageSub:     { fontSize:13, color:'#64748B', margin:'2px 0 0' },
  btn:         { padding:'7px 14px', border:'1px solid #E2E8F0', borderRadius:8, background:'#fff', fontSize:13, cursor:'pointer', color:'#374151', fontFamily:'inherit' },
  btnPrimary:  { padding:'8px 16px', background:'#2E5FA3', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' },
  card:        { background:'#fff', border:'1px solid #E8EBF0', borderRadius:12, padding:16, marginBottom:14 },
  cardTitle:   { fontSize:13, fontWeight:600, color:'#1E293B', marginBottom:14 },
  sectionTitle:{ fontSize:11, fontWeight:600, color:'#2E5FA3', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8, paddingBottom:5, borderBottom:'1px solid #EEF3FB' },
  label:       { display:'block', fontSize:11, fontWeight:600, color:'#64748B', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:5 },
  input:       { width:'100%', padding:'8px 10px', border:'1px solid #E2E8F0', borderRadius:8, fontSize:13, color:'#374151', background:'#FAFAFA', fontFamily:'inherit', boxSizing:'border-box' },
  cellInput:   { width:'100%', padding:'4px 6px', border:'1px solid #E8EBF0', borderRadius:5, fontSize:12, color:'#374151', textAlign:'center', fontFamily:'inherit', background:'transparent' },
  table:       { width:'100%', borderCollapse:'collapse', fontSize:13 },
  th:          { background:'#F8FAFC', padding:'8px 10px', textAlign:'left', fontSize:11, fontWeight:600, color:'#64748B', textTransform:'uppercase', letterSpacing:'0.04em', borderBottom:'1px solid #E8EBF0' },
  td:          { padding:'8px 10px', borderBottom:'1px solid #F1F5F9', color:'#374151' },
};