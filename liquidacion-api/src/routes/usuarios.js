const router        = require('express').Router();
const ctrl          = require('../controllers/usuariosController');
const auth          = require('../middleware/auth');

router.get('/catalogos',    auth, ctrl.catalogos);
router.get('/',             auth, auth.requireRol('superadmin','admin','jefe'), ctrl.listar);
router.get('/:id',          auth, auth.requireRol('superadmin','admin','jefe'), ctrl.obtener);
router.post('/',            auth, auth.requireRol('superadmin','admin','jefe'), ctrl.crear);
router.put('/:id',          auth, auth.requireRol('superadmin','admin','jefe'), ctrl.actualizar);
router.patch('/:id/estado', auth, auth.requireRol('superadmin','admin','jefe'), ctrl.toggleEstado);

module.exports = router;