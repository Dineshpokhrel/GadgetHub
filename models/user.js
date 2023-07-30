const mongoose = require("mongoose");
const validator = require("validator");

const { Schema, model } = mongoose;

const CartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: Number,
  priceAfterDiscount: Number,
});

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter name."],
    },
    phone: String,
    avatar: String,
    address: String,
    email: {
      type: String,
      unique: true,
      index: true,
      required: [true, "Email is required."],
      validate: [validator.isEmail, "Please enter valid email address"],
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
      minLength: [6, "Please enter at least 6 characters"],
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    cart: [CartItemSchema],
    order: [{
      type: Schema.Types.ObjectId,
      ref: "Order",
    }],
    shipping_address: [{
      type: Schema.Types.ObjectId,
      ref: "ShippingAddress",
    }],
    facebookID: {
      type: String,
      select: false,
    },
    googleID: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending", "banned"],
    },
    socialLogin: {
      type: Boolean,
      default: false,
    },
    lastLoggedIn: Date,
  },
  { timestamps: true }
);

const CartItem = model("CartItem", CartItemSchema);
const User = model("User", UserSchema);

module.exports = {
  User,
  CartItem,
};


//example
// const cartItemData = {
//     product: productId,            // ID of the product added to the cart
//     quantity: 2,                   // Quantity of the product
//     priceAfterDiscount: 19.99,     // Price of the product after applying any discounts
//   };
  
//   // Add the cartItemData to the user's cart
//   const user = await User.findById(userId);
//   user.cart.push(cartItemData);
//   await user.save();
  

// By using the CartItemSchema, the application can keep track of individual items in the user's cart, 
// their quantities, and their prices after applying discounts. This allows for better management of the
//  shopping cart and facilitates order processing during checkout.