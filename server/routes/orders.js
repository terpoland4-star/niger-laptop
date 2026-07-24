const router = require('express').Router();
const ctrl = require('../controllers/orderController');

router.post('/', ctrl.createOrder);
router.get('/my-orders', ctrl.getMyOrders);
router.get('/:id', ctrl.getOrder);

module.exports = router;
