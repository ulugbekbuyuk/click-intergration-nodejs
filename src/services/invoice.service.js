const axios = require('axios').default;
const { findByToken, updateByToken } = require('./../db');
// const {} = require('./../dbs/mysqldb/payment.persistence');  // for MySQL database
const PaymentStatus = require('./../config/payment-status');

const createInvoice = async (params) => {
    try {
        const { token } = params;
        const data = await findByToken(token);

        if (data['status'] !== PaymentStatus.INPUT && data['status'] !== PaymentStatus.REFUNDED) {
            // 
        }

        const url = 'invoice/status/' + data['service_id'] + '/' + data['invoice_id'];
        const httpResponse = await axios.get(url);

        if (httpResponse.status === 200) {
            const httpData = httpResponse.data;
            if (httpData['error_code'] === 0) {
                //...
            }
        }

    } catch (error) {

    }

}

const checkInvoice = async (params) => {
    try {
        const data = await findByToken(params['token']);

        if (data['invoice_id'] !== params['invoice_id']) throw new Error();

        const url = 'invoice/status/' + provider['service_id'] + '/' + data['invoice_id'];
        const httpResponse = await axios.get(url);

        if (httpResponse.status !== 200) throw new Error();

        const httpData = httpResponse.data;
        if (httpData['error_code'] !== 0) return httpData;

        if (httpData['status'] > 0) {
            await updateByToken(params['token'], {
                'status': PaymentStatus.CONFIRMED,
                'status_note': httpData['error_note'] 
            });
        } else if (httpData['status'] === -99) {
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



    } catch (error) {

    }
}


module.exports = {
    createInvoice,
    checkInvoice
}