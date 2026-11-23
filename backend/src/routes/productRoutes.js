
const { Router } = require('express');

const controller = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.get('/search', controller.search);
router.get('/:id', controller.show);

router.post('/', authMiddleware, controller.store);
router.put('/:id', authMiddleware, controller.update);
router.delete('/:id', authMiddleware, controller.destroy);

module.exports = router;
