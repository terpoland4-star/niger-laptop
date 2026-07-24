const router = require('express').Router();
const ctrl = require('../controllers/productController');

router.get('/', ctrl.getAllProducts);
router.get('/:id', ctrl.getProduct);

module.exports = router;
