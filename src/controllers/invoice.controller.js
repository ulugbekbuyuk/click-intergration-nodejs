const { findByMerchantTransId, updateById, findByToken, updateByToken } = require("./../db");
const PaymentStatus = require("./../config/payment-status");
const { ClickError } = require('./../utils/error');
const axios = require('axios').default;

module.exports = {
    createInvoice: async function (req, res, next) {
        try {
            const payment = await findByToken(req.body['token']);
            if (payment && payment['status'] !== PaymentStatus.INPUT && payment['status'] !== PaymentStatus.REFUNDED) {
                return next(new ClickError('Payment in processing', -31300));
            }

            await updateById(payment['id'], {
                'merchant_trans_id': payment['id']
            });

            const url = 'invoice/create';
            const httpResponse = await axios.post(url, {
                'service_id': process.env.SERVICE_ID,
                'merchant_trans_id': payment['id'],
                'phone_number': req.body['phone_number'],
                'amount': payment['total']
            });

            if (httpResponse.status === 200) {
                const httpData = httpResponse.data;
                if (httpData['error_code'] === 0) {
                    await updateByToken(req.body['token'], {
                        'status': PaymentStatus.WAITING,
                        'status_note': httpData['error_note'],
                        'invoice_id': httpData['invoice_id'],
                        'phone_number': httpData['phone_number']
                    });
                } else {
                    await updateById(payment['id'], {
                        'status': PaymentStatus.ERROR,
                        'status_note': httpData['error_note']
                    });
                }
                return res.status(200).json(httpData);
            }
            return next(new ClickError(httpResponse.statusText, ClickError.ERROR_INSUFFICIENT_PRIVILEGE));
        } catch (error) {
            return next(new ClickError('Incorrect request', ClickError.ERROR_METHOD_NOT_FOUND));
        }
    },

    checkInvoice: async function (req, res, next) {
        try {
            const payment = await findByToken(req.body['token']);
            if (payment['invoice_id'] === req.body['invoice_id']) {
                const url = 'invoice/status/' + process.env.SERVICE_ID + '/' + req.body['invoice_id'];
                const httpResponse = await axios.get(url);
                if (httpResponse.status === 200) {
                    const httpData = httpResponse.data;
                    if (httpData['error_code'] > 0) {
                        await updateByToken(req.body['token'], {
                            'status': PaymentStatus.CONFIRMED,
                            'status_note': httpData['error_note']
                        });
                    } else if (httpData['status'] === -99) {
                        await updateByToken(req.body['token'], {
                            'status': PaymentStatus.REJECTED,
                            'status_note': httpData['error_note']
                        });
                    } else {
                        await updateByToken(req.body['token'], {
                            'status': PaymentStatus.ERROR,
                            'status_note': httpData['error_note']
                        });
                    }
                }
                return (httpData) ? res.status(200).json(httpData) :
                    next(new ClickError(httpResponse.statusText, ClickError.ERROR_INSUFFICIENT_PRIVILEGE));
            }
            return next(new ClickError('Incorrect invoice id', ClickError.ERROR_COULD_NOT_PERFORM));
        } catch (error) {
            return next(new ClickError('Incorrect request', ClickError.ERROR_METHOD_NOT_FOUND));
        }
    }
}