const { Router } = require('express');
const User = require('../../models/user');
const OrderItem = require('../../models/orderitem');
const Order = require('../../models/order');
const ShippingAddress = require('../../models/shipping_address');
const constants = require('../../config/constants');

const router = Router();

const getMyOrder = async (req, res) => {
    try {
        const user = req.user;
        console.log(user);
        const orders = await Order.find({ user: user?.id }).sort({ createdAt: -1 });
        res.status(200).json({
            status: true,
            message: "Successfully fetched orders",
            data: orders
        });
    }
    catch (error) {
        res.status(400).json({ status: false, message: "Something went wrong. Please try again." });
    }
};

const placeOrder = async (req, res) => {
    try {
        const { orderId, customerId, shippingPrice, discount, totalPrice, shippingAddress, paymentMethod, note, cart } = req.body;

        const user_cart = cart;
        const taxPrice = 0;
        let paymentStatus = "unpaid";

        if (paymentMethod === "stripe") {
            paymentStatus = "paid";
        }

        const shippingAddr = {
            user: customerId,
            country: shippingAddress.country,
            address: shippingAddress.address,
            phone: shippingAddress.phone,
            postalCode: shippingAddress.postalCode,
            name: "home",
        }

        const orderItems = []

        if (user_cart && user_cart.length > 0) {
            for (const item of user_cart) {
                const { id, name, priceAfterDiscount, image, quantity } = item;
                const orderItem = await OrderItem.create({ name, price: priceAfterDiscount, image, product: { _id: id }, quantity });
                orderItems.push(orderItem)
            }
        }
        else {
            res.status(409).json({
                status: false, message: "Please add item in the cart."
            })
            return;
        }

        const orderPrice = orderItems.reduce((acc, item) => acc + Math.floor(Number(item.price)) * Math.floor(Number(item.quantity)), 0);

        const order = await Order.create({
            orderID: orderId,
            user: customerId,
            orderItems,
            shippingAddress: {
                country: shippingAddr.country,
                address: shippingAddr.address,
                phone: shippingAddr.phone,
                postalCode: shippingAddr.postalCode,
                name: shippingAddr.name,
            },
            paymentMethod,
            discount,
            shippingPrice,
            taxPrice,
            orderPrice,
            totalPrice,
            note,
            paymentStatus: paymentStatus,
            orderStatus: "pending",
        });

        if (order && order._id) {
            await User.findByIdAndUpdate(customerId, {
                $set: {
                    cart: [],
                },
                $addToSet: {
                    order: order._id,
                }
            })

            res.status(200).json({ status: true, message: "Order placed successfully.", data: order })
        }
        else {
            res.status(409).json({ status: false, message: "Something went wrong while creating order." })
        }
    }
    catch (error) {
        res.status(400).json({ status: false, message: error.message || "Error occurred while placing order." })
    }
}

module.exports = {
    placeOrder,
    getMyOrder,
};
