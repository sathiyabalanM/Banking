const mongoose = require('mongoose');

const CustomersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        street: String,
        city: String,
        state: {
            type: String,
            uppercase: true,
            required: true,
            enum: ["TAMILNADU","KERALA","KARNATAGA","ANDRAPRADESH"]
        },
        pin: Number
    },
},{
    timestamps: true
});

const Customers = mongoose.model("Customers", CustomersSchema);

module.exports = Customers;