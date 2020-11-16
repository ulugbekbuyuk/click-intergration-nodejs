const paymentService = require('./../services/payment.service');

module.exports = {
    byPaymentId: async (req, res, next) => {
        // await checkPaymentStatusByPaymentId(req.body);

    },

    byMerchantTransId: async (req, res, next) => {
        // await checkPaymentStatusWithMerchantTransId(req.body);
    },

    cancelPayment: async (req, res, next) => {
        // await cancelPayment(req.body);
    }
}