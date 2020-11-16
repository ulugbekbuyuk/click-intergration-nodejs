const Payment = require('./payment.model');

const findById = async (payment_id) => {}

const findByToken = async (token) => {}

const findByMerchantTransId = async (merchant_trans_id) => {}

const updateById = async (payment_id, ...arguments) => {}

const updateByToken = async (token, ...arguments) => {}

module.exports = {
    findById,
    findByToken,
    findByMerchantTransId,
    updateById,
    updateByToken
}