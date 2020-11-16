const axios = require('axios').default;
const { findByToken, updateByToken } = require('./../db');
// const {} = require('./../dbs/mysqldb/payment.persistence');  // for MySQL database
const PaymentStatus = require('./../config/payment-status');

const createCardToken = async (params) => {
    try {
        const data = await findByToken(params['token']);

        
    } catch (error) {
        
    }
}

const verifyCardToken = async (params) => {}

const paymentWithCardToken = async (params) => {}

const deleteCardToken = async (params) => {}


module.exports = {
    createCardToken,
    verifyCardToken,
    paymentWithCardToken,
    deleteCardToken
}