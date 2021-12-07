const mongoose = require('mongoose');

const AccountsSchema = new mongoose.Schema({
    ac_number: {
        type: Number,
        required: true,
        trim: true,
        unique: true,
        min: 100000000,
        max: 999999999
    },
    balance: {
        type: Number,
        trim: true,
        required: true,
        min: 5000
    },
    type: {
        type: String,
        required: true,
        enum:["SAVING","CURRENT","DMAT"],
        default: "SAVING"
    },
    customer_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Customers",
        required: true
    }
},{
    timestamps: true
});

const Accounts = mongoose.model("Accounts", AccountsSchema);

module.exports = Accounts;