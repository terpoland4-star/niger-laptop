const router = require('express').Router();
const ctrl = require('../controllers/paymentController');

router.post('/initiate', ctrl.initiatePayment);
router.get('/status/:orderId', ctrl.checkPaymentStatus);

module.exports = router;
