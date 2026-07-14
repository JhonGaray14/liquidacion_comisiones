const pool   = require('../config/db');
const bcrypt = require('bcryptjs');

// GET /api/usuarios
exports.listar = async (req, res) => {
  try {
    let query, params = [];

    if (req.user.rol === 'jefe') {
      query = `
        SELECT u.id, u.nombre, u.correo, u.usuario, u.rol, u.codvend,
               c.nombre AS canal, r.nombre AS regional,
               u.estado, u.id_jefe, u.created_at
        FROM usuarios u
        LEFT JOIN canales    c ON u.id_canal    = c.id
        LEFT JOIN regionales r ON u.id_regional = r.id
        WHERE u.id_jefe = ?
        ORDER BY u.nombre`;
      params = [req.user.id];
    } else {
      query = `
        SELECT u.id, u.nombre, u.correo, u.usuario, u.rol, u.codvend,
               c.nombre AS canal, r.nombre AS regional,
               u.estado, u.id_jefe, u.created_at,
               j.nombre AS nombre_jefe
        FROM usuarios u
        LEFT JOIN canales    c ON u.id_canal    = c.id
        LEFT JOIN regionales r ON u.id_regional = r.id
        LEFT JOIN usuarios   j ON u.id_jefe     = j.id
        ORDER BY u.rol, u.nombre`;
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// GET /api/usuarios/catalogos — canales y regionales para los selects
exports.catalogos = async (req, res) => {
  try {
    const [canales]    = await pool.query('SELECT id, nombre FROM canales    ORDER BY nombre');
    const [regionales] = await pool.query('SELECT id, nombre FROM regionales ORDER BY nombre');
    res.json({ canales, regionales });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener catálogos' });
  }
};

// GET /api/usuarios/:id
exports.obtener = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.nombre, u.correo, u.usuario, u.rol, u.codvend,
              u.id_canal, u.id_regional, c.nombre AS canal,
              r.nombre AS regional, u.estado, u.id_jefe
       FROM usuarios u
       LEFT JOIN canales    c ON u.id_canal    = c.id
       LEFT JOIN regionales r ON u.id_regional = r.id
       WHERE u.id = ?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (req.user.rol === 'jefe' && rows[0].id_jefe !== req.user.id)
      return res.status(403).json({ error: 'Sin permiso' });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

// POST /api/usuarios
exports.crear = async (req, res) => {
  const { nombre, correo, usuario, contrasena, rol, codvend, id_canal, id_regional, id_jefe } = req.body;

  if (!nombre || !correo || !usuario || !contrasena)
    return res.status(400).json({ error: 'Faltan campos obligatorios' });

  // El jefe siempre crea vendedores asignados a sí mismo
  // y hereda su propio canal y regional
  const esJefe    = req.user.rol === 'jefe';
  const rolFinal  = esJefe ? 'vendedor'    : rol;
  const jefeFinal = esJefe ? req.user.id   : (id_jefe || null);

  // Si es jefe, hereda su canal/regional automáticamente
  let canalFinal    = id_canal    || null;
  let regionalFinal = id_regional || null;

  if (esJefe) {
    const [jefeRow] = await pool.query(
      'SELECT id_canal, id_regional FROM usuarios WHERE id = ?', [req.user.id]
    );
    canalFinal    = jefeRow[0]?.id_canal    || null;
    regionalFinal = jefeRow[0]?.id_regional || null;
  }

  try {
    const hash = await bcrypt.hash(contrasena, 12);
    const [result] = await pool.query(
      `INSERT INTO usuarios
         (nombre, correo, usuario, contrasena, rol, codvend, id_canal, id_regional, id_jefe, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'activo')`,
      [nombre, correo, usuario, hash, rolFinal, codvend || null, canalFinal, regionalFinal, jefeFinal]
    );
    res.status(201).json({ id: result.insertId, mensaje: 'Usuario creado correctamente' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'El usuario o correo ya existe' });
    console.error(err);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

// PUT /api/usuarios/:id
exports.actualizar = async (req, res) => {
  const { nombre, correo, id_canal, id_regional, rol, codvend, estado, contrasena } = req.body;
  const { id } = req.params;

  try {
    if (req.user.rol === 'jefe') {
      const [rows] = await pool.query('SELECT id_jefe FROM usuarios WHERE id = ?', [id]);
      if (!rows.length || rows[0].id_jefe !== req.user.id)
        return res.status(403).json({ error: 'Sin permiso para editar este usuario' });
    }

    const campos = [nombre, correo, id_canal || null, id_regional || null, rol, codvend || null, estado];
    let query = `UPDATE usuarios
                 SET nombre=?, correo=?, id_canal=?, id_regional=?, rol=?, codvend=?, estado=?,
                     updated_at=NOW()`;

    if (contrasena) {
      const hash = await bcrypt.hash(contrasena, 12);
      query += ', contrasena=?';
      campos.push(hash);
    }

    query += ' WHERE id=?';
    campos.push(id);

    await pool.query(query, campos);
    res.json({ mensaje: 'Usuario actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// PATCH /api/usuarios/:id/estado
exports.toggleEstado = async (req, res) => {
  const { estado } = req.body;
  if (!['activo','inactivo'].includes(estado))
    return res.status(400).json({ error: 'Estado inválido' });

  try {
    if (req.user.rol === 'jefe') {
      const [rows] = await pool.query('SELECT id_jefe FROM usuarios WHERE id = ?', [req.params.id]);
      if (!rows.length || rows[0].id_jefe !== req.user.id)
        return res.status(403).json({ error: 'Sin permiso' });
    }
    await pool.query(
      'UPDATE usuarios SET estado=?, updated_at=NOW() WHERE id=?',
      [estado, req.params.id]
    );
    res.json({ mensaje: `Usuario ${estado} correctamente` });
  } catch (err) {
    res.status(500).json({ error: 'Error al cambiar estado' });
  }
};