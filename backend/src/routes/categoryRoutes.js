
const { Router } = require('express');

const controller = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

// Consultas públicas
router.get('/search', controller.search);
router.get('/:id', controller.show);

// Operações protegidas
router.post('/', authMiddleware, controller.store);
router.put('/:id', authMiddleware, controller.update);
router.delete('/:id', authMiddleware, controller.destroy);

module.exports = router;
