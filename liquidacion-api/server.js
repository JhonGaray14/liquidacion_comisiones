require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const authRoutes     = require('./src/routes/auth');
const usuariosRoutes = require('./src/routes/usuarios');

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use('/api/auth',     authRoutes);
app.use('/api/usuarios', usuariosRoutes);

app.get('/', (_, res) => res.json({ ok: true, msg: 'API Liquidación de Comisiones' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`));