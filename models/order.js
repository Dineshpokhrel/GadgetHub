const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  orderID: {
    type: String,
    unique: true,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  orderItems: [{
    type: Schema.Types.ObjectId,
    ref: "OrderItem", // This should match the model name for OrderItem
  }],
  shippingAddress: {
    country: String,
    address: String,
    phone: String,
    postalCode: String,
    name: String,
  },
  paymentMethod: {
    type: String,
    enum: ["cod", "esewa", "paypal", "stripe"],
    default: "cod",
  },
  orderStatus: {
    type: String,
    enum: ["pending", "processing", "delivered", "cancelled"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["paid", "unpaid", "failed"],
    default: "unpaid",
  },
  paidAt: Date,
  discount: {
    type: Number,
    required: false,
    default: 0.0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  orderPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  note: String,
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
