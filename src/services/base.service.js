const axios = require('axios').default;
const { findByMerchantTransId, updateById } = require('./../db');
// const {} = require('./../dbs/mysqldb/payment.persistence');  // for MySQL database
const PaymentStatus = require('./../config/payment-status');

const prepareRequest = async (params) => {
    try {
        const payment = await findByMerchantTransId(params['merchant_trans_id']);
        let merchant_confirm_id = 0;
        let merchant_prepare_id = 0;

        if(payment) {
            merchant_confirm_id = payment['id'];
            merchant_prepare_id = payment['id'];
        }

        let result = await requestCheck(params);

        result = { 
            ...result, 
            'click_trans_id': params['click_trans_id'],
            'merchant_trans_id':  params['merchant_trans_id'],
            'merchant_confirm_id':  merchant_confirm_id,
            'merchant_prepare_id':  merchant_prepare_id
        };

        if(result['error'] === 0) {
            await updateById(payment['id'], {
                'status': PaymentStatus.WAITING
            });
        }

        return result;
        
    } catch (error) {
        
    }
}

const completeRequest = async (params) => {

}

const requestCheck = async (params) => {
    
}

module.exports = {
    prepareRequest,
    completeRequest,
    cancelPayment
}