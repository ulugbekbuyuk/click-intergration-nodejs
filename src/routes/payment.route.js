const router = require('express').Router();
const validator = require('./../validations/invoice.validation');
const controller = require('./../controllers/payment.controller');

router.post('/status', controller.byPaymentId);
router.post('/merchant_train_id', controller.byMerchantTransId);
router.post('/cancel', controller.cancelPayment);

module.exports = router;