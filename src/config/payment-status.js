PaymentStatus = Object.freeze({
    INPUT: 'input',
    WAITING: 'waiting',
    PREAUTH: 'preauth',
    CONFIRMED: 'confirmed',
    REJECTED: 'rejected',
    REFUNDED: 'refunded',
    ERROR: 'error'
});

module.exports = PaymentStatus;