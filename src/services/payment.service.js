const axios = require('axios').default;
const { findByToken, updateByToken } = require('./../db');
// const {} = require('./../dbs/mysqldb/payment.persistence');  // for MySQL database
const PaymentStatus = require('./../config/payment-status');

const checkPaymentStatusByPaymentId = async (params) => {
    try {
        const url = 'payment/status/' + provider['service_id'] + '/' + params['payment_id'];
        const httpResponse = await axios.get(url);

        if(httpResponse.status !== 200) return null;

        const httpData = httpResponse.data;
        if(httpData['error_code'] === 0) {
            if(httpData['status'] > 0) {
                await updateByToken(params['token'], {
                    'status': PaymentStatus.CONFIRMED,
                    'status_note': httpData['error_note']
                });
            } else if(httpData['status'] === -99) {
                await updateByToken(params['token'], {
                    'status': PaymentStatus.REJECTED,
                    'status_note': httpData['error_note']
                });
            } else {
                await updateByToken(params['token'], {
                    'status': PaymentStatus.ERROR,
                    'status_note': httpData['error_note']
                });
            }
        }
        return httpData;        
    } catch (error) {
        
    }
}


const checkPaymentStatusWithMerchantTransId = async (params) => {
    try {

        const url = 'payment/status_by_mti/' + provider['service_id'] + '/' + params['merchant_trans_id'];
        const httpResponse = await axios.get(url);

        if(httpResponse.status !== 200) return null;

        const httpData = httpResponse.data;
        if(httpData['error_code'] === 0) {
            await updateByToken(params['token'], {
                'payment_id': httpData['payment_id'],
                'merchant_trans_id': httpData['merchant_trans_id'],
                'status_note': httpData['error_note']
            });
        } else {
            await updateByToken(params['token'], {
                'status': PaymentStatus.ERROR,
                'status_note': httpData['error_note']
            });
        }

        return httpData;
        
    } catch (error) {
        
    }
}

const cancelPayment = async (params) => {
    try {
        const url = 'payment/reversal/' + provider['service_id'] + '/' + params['payment_id'];
        const httpResponse = await axios.delete(url);

        if(httpResponse.status !== 200) return null;

        const httpData = httpResponse.data;
        if(httpData['error_code'] === 0) {
            await updateByToken(params['token'], {
                'status':  PaymentStatus.REJECTED,
                'status_note':  httpData['error_note'],
                'payment_id':  httpData['payment_id']
            });
        } else {
            await updateByToken(params['token'], {
                'status':  PaymentStatus.ERROR,
                'status_note':  httpData['error_note']
            });
        }

        return httpData;
        
    } catch (error) {
        
    }
}

module.exports = {
    checkPaymentStatusByPaymentId,
    checkPaymentStatusWithMerchantTransId,
    cancelPayment
}