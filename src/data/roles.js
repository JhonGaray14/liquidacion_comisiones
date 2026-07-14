export const ROLES = {
  superadmin: {
    label: 'Super Administrador',
    nav: ['dashboard','carga','liquidacion','historico','usuarios','parametros']
  },
  admin: {
    label: 'Administrador',
    nav: ['dashboard','carga','liquidacion','historico']
  },
  jefe: {
    label: 'Jefe de canal',
    nav: ['dashboard','liquidacion','historico', 'usuarios']
  },
  nomina: {
    label: 'Nómina',
    nav: ['dashboard','liquidacion','historico']
  }
};

export const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard',        icon: 'bi-speedometer2',  path: '/dashboard' },
  { id: 'carga',        label: 'Carga de datos',   icon: 'bi-upload',        path: '/carga' },
  { id: 'liquidacion',  label: 'Liquidación',       icon: 'bi-calculator',    path: '/liquidacion' },
  { id: 'historico',    label: 'Histórico',         icon: 'bi-clock-history', path: '/historico' },
  { id: 'usuarios',     label: 'Usuarios y roles',  icon: 'bi-people',        path: '/usuarios',   divider: true },
  { id: 'parametros',   label: 'Parámetros',        icon: 'bi-sliders',       path: '/parametros' },
];