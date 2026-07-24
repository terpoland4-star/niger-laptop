const router = require('express').Router();
const ctrl = require('../controllers/authController');

router.post('/send-otp', ctrl.sendOTP);
router.post('/verify-otp', ctrl.verifyOTP);

module.exports = router;
