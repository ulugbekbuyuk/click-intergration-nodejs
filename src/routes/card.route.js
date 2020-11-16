const router = require('express').Router();
// const validator = require('./../validations/invoice.validation');
const {
    createCard,
    verifyCard,
    paymentWithCard,
    deleteCard
} = require('./../controllers/card.controller');

router.post('/create', createCard);
router.post('/verify', verifyCard);
router.post('/payment', paymentWithCard);
router.post('/delete', deleteCard);

module.exports = router;