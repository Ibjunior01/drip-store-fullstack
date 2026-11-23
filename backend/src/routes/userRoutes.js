
const { Router } = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = Router();

// Cadastro público
router.post('/', userController.store);

// Login público
router.post('/token', authController.login);

module.exports = router;
