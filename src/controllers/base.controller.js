const { findByMerchantTransId, updateById } = require("./../db");
const PaymentStatus = require("./../config/payment-status");
const { ClickError } = require('./../utils/error');

module.exports = {
  prepare: async (req, res, next) => {
    try {
      const payment = await findByMerchantTransId(
        req.body["merchant_trans_id"]
      );
      let merchant_confirm_id = 0;
      let merchant_prepare_id = 0;

      if (payment) {
        merchant_confirm_id = payment["id"];
        merchant_prepare_id = payment["id"];
      }

      if (req.body["error"] === 0) {
        await updateById(payment["id"], {
          status: PaymentStatus.WAITING,
        });
      }

      return res.status(200).json({
        click_trans_id: req.body["click_trans_id"],
        merchant_trans_id: req.body["merchant_trans_id"],
        merchant_confirm_id: merchant_confirm_id,
        merchant_prepare_id: merchant_prepare_id,
        error: req.body["error"],
        error_note: req.body["error_note"],
      });
    } catch (error) {
      return next(new ClickError('Incorrect request', ClickError.ERROR_METHOD_NOT_FOUND));
    }
  },

  complete: async (req, res, next) => {
    try {
      const payment = await findByMerchantTransId(
        req.body["merchant_trans_id"]
      );
      let merchant_confirm_id = 0;
      let merchant_prepare_id = 0;

      if (payment) {
        merchant_confirm_id = payment["id"];
        merchant_prepare_id = payment["id"];
      }

      if (req.body["error"] < 0 && ![-4, -9].includes(req.body["error"])) {
        await updateById(payment["id"], {
          status: PaymentStatus.REJECTED,
        });

        return res.status(200).json({
          error: -9,
          error_note: "Transaction cancelled",
        });
      } else if (req.body["error"] === 0) {
        await updateById(payment["id"], {
          status: PaymentStatus.CONFIRMED,
        });
      }

      return res.status(200).json({
        click_trans_id: req.body["click_trans_id"],
        merchant_trans_id: req.body["merchant_trans_id"],
        merchant_confirm_id: merchant_confirm_id,
        merchant_prepare_id: merchant_prepare_id,
        error: req.body["error"],
        error_note: req.body["error_note"],
      });
    } catch (error) {
      return next(new ClickError('Incorrect request', ClickError.ERROR_METHOD_NOT_FOUND));
    }
  },
};