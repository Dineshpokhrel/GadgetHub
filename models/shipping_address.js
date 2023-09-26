const mongoose = require("mongoose");

const { Schema } = mongoose;

// Replace './user' with the correct path to your user model if needed
const User = require('./user');

const ShippingAddressSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    country: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String },
    postalCode: String,
    name: String,
});

const ShippingAddress = mongoose.model("ShippingAddress", ShippingAddressSchema);

module.exports = ShippingAddress;
