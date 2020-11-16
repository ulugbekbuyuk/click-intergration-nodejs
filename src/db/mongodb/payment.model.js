const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({});

module.exports = mongoose.model('Payment', paymentSchema);