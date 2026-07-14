require('dotenv').config();
const pool   = require('./src/config/db');
const bcrypt = require('bcryptjs');

(async () => {
  // Obtener IDs de catálogos
  const [canales]    = await pool.query('SELECT id, nombre FROM canales');
  const [regionales] = await pool.query('SELECT id, nombre FROM regionales');

  const canal = nombre => canales.find(c => c.nombre === nombre)?.id || null;
  const reg   = nombre => regionales.find(r => r.nombre === nombre)?.id || null;

  const usuarios = [
    { nombre:'Pablo Rodríguez',   correo:'pablo@madronho.com',     usuario:'superadmin',  pass:'Admin2026*', rol:'superadmin', canal:null,            regional:null,         id_jefe:null },
    { nombre:'Auditoría Interna', correo:'auditoria@madronho.com', usuario:'admin',        pass:'Admin2026*', rol:'admin',      canal:null,            regional:null,         id_jefe:null },
    { nombre:'Jefe Food Service', correo:'fs@madronho.com',        usuario:'jefe_fs',      pass:'Admin2026*', rol:'jefe',       canal:'Food service',  regional:'Oriente',  id_jefe:null },
    { nombre:'Jefe Retail',       correo:'retail@madronho.com',    usuario:'jefe_retail',  pass:'Admin2026*', rol:'jefe',       canal:'Call Center',        regional:'Oriente',     id_jefe:null },
    { nombre:'Nómina RRHH',       correo:'nomina@madronho.com',    usuario:'nomina',        pass:'Admin2026*', rol:'nomina',     canal:null,            regional:null,         id_jefe:null },
  ];

  for (const u of usuarios) {
    const hash = await bcrypt.hash(u.pass, 12);
    await pool.query(
      `INSERT IGNORE INTO usuarios
         (nombre, correo, usuario, contrasena, rol, id_canal, id_regional, id_jefe)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [u.nombre, u.correo, u.usuario, hash, u.rol, canal(u.canal), reg(u.regional), u.id_jefe]
    );
    console.log(`✅ ${u.usuario} insertado`);
  }

  console.log('Seed completado');
  process.exit(0);
})();