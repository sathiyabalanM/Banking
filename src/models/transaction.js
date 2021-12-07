const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    from_ac: {
        type: Number,
        required: true,
        trim: true,
        min: 100000000,
        max: 999999999
    },
    to_ac: {
        type: Number,
        required: true,
        trim: true,
        min: 100000000,
        max: 999999999
    },
    amount: {
        type: Number,
        required: true
    }
},{
    timestamps: true
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;