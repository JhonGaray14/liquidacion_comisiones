const pool    = require('../config/db');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { usuario, contrasena } = req.body;

  if (!usuario || !contrasena)
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });

  try {
    const [rows] = await pool.query(
      `SELECT u.*, j.nombre AS nombre_jefe
       FROM usuarios u
       LEFT JOIN usuarios j ON u.id_jefe = j.id
       WHERE u.usuario = ? AND u.estado = 'activo'`,
      [usuario]
    );

    if (!rows.length)
      return res.status(401).json({ error: 'Usuario no encontrado o inactivo' });

    const user = rows[0];
    const ok   = await bcrypt.compare(contrasena, user.contrasena);
    if (!ok)
      return res.status(401).json({ error: 'Contraseña incorrecta' });

    const payload = {
      id:        user.id,
      nombre:    user.nombre,
      usuario:   user.usuario,
      correo:    user.correo,
      rol:       user.rol,
      canal:     user.canal,
      regional:  user.regional,
      id_jefe:   user.id_jefe,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    res.json({ token, user: payload });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};