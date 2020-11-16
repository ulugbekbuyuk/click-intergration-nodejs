const Payment = require('./payment.model');

const findById = async (payment_id) => {
    // MongoDB implementation
}

const findByToken = async (token) => {
    // MongoDB implementation
}

const findByMerchantTransId = async (merchant_trans_id) => {
    // MongoDB implementation
}

const updateById = async (payment_id, data) => {
    // MongoDB implementation
}

const updateByToken = async (token, data) => {
    // MongoDB implementation
}

module.exports = {
    findById,
    findByToken,
    findByMerchantTransId,
    updateById,
    updateByToken
}