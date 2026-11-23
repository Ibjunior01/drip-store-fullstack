
const { Router } = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

// Rotas públicas
router.post('/', userController.store);
router.post('/token', authController.login);
router.get('/:id', userController.show);

// Rotas protegidas por JWT
router.put('/:id', authMiddleware, userController.update);
router.delete('/:id', authMiddleware, userController.destroy);

module.exports = router;
