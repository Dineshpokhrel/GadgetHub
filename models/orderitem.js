const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const product = require("./product");

const OrderItemSchema = new Schema({
    name: String,
    description: String,
    image: String,
    product:[ 
        { 
        type: Schema.Types.ObjectId, ref: "Product" 
        }
        ],
    quantity: Number,
    price: Number
}, { timestamps: true });

const OrderItem = model("OrderItem", OrderItemSchema);

module.exports = OrderItem;
