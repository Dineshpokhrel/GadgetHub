const { Request, Response } = require("express");
const Order = require("../../models/order");
const Product = require("../../models/product");
const Settings = require("../../models/setting"); // Import your Settings model
const { generatePdfInvoice } = require("../../utils/invoice");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const config = require("../../config");

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: config.mail.api_key,
  },
}));

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("user", "_id name email phone")
      .lean();

    res.status(200).json({
      status: true,
      message: "Successfully fetched orders.",
      data: orders,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "_id name")
      .populate("product")
      .lean();

    if (order) {
      res.status(200).json({
        status: true,
        message: "Successfully get the order",
        data: order,
      });
    } else {
      res.status(404).json({ status: false, message: "Order not found." });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const orderId = req.params.id;
    const prevOrder = await Order.findById(orderId);

    if (!prevOrder) {
      res.status(404).json({
        status: false,
        message: "Order not found.",
      });
      return;
    }

    if (prevOrder.paymentStatus !== "paid" && orderStatus === "delivered") {
      const paidAt = new Date();
      const paymentStatus = "paid";

      const { orderItems } = prevOrder;

      for (const item of orderItems) {
        const { product, quantity } = item;
        const productItem = await Product.findById(product);

        if (!productItem) {
          res.status(404).json({
            status: false,
            message: "Product not found.",
          });
          return;
        }

        if (!quantity || (quantity && quantity < 1)) {
          res.status(400).json({
            status: false,
            message: "Item should have at least one quantity.",
          });
          return;
        }

        const availableQty = productItem.quantity;

        if (availableQty <= 0) {
          res.status(400).json({
            status: false,
            message: "Item out of stock.",
          });
          return;
        }

        if (availableQty < quantity) {
          res.status(400).json({
            status: false,
            message: "Item out of stock. Required quantity should be greater than available quantity.",
          });
          return;
        }

        const remainingQuantity = availableQty - quantity;
        const newProduct = await Product.findByIdAndUpdate(
          product,
          { quantity: remainingQuantity },
          { new: true }
        );
      }

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { paidAt, paymentStatus, orderStatus },
        { new: true }
      ).populate("user", "_id name email phone");

      res.status(200).json({
        status: true,
        message: "Order updated successfully.",
        data: order,
      });

      // Send email notification
      const email = {
        to: 'Dineshpokhrel500@gmail.com',
        from: 'iamdineshpokhrel@gmail.com',
        subject: 'Order is placed successfully.',
        text: 'Awesome sauce',
        html: '<b>Your order has been placed successfully.</b>'
      };

      transporter.sendMail(email, (err, response) => {
        if (err) {
          console.log(err);
        }
        console.log('success', response);
      });

      return;
    } else {
      const paidAt = prevOrder.paidAt ? prevOrder.paidAt : new Date();

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { paidAt, orderStatus },
        { new: true }
      ).populate("user", "_id name email phone");

      res.status(200).json({
        status: true,
        message: "Order updated successfully.",
        data: order,
      });

      return;
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (order) {
      return res.status(200).json({
        status: true,
        message: "Order deleted successfully.",
        data: order,
      });
    }
    return res.status(404).json({ status: false, message: "Order not found." });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

const getOrderInvoice = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findOne({ _id: orderId })
      .populate("user", "_id name email phone")
      .lean();
    const systemInfo = await Settings.findOne();

    if (!order) {
      res.status(404).json({
        status: false,
        message: "Order not found.",
      });
      return;
    }

    const path = await generatePdfInvoice(
      order,
      systemInfo,
      `uploads/orders/${orderId}.pdf`
    );

    res.download(path, (error) => {
      console.error(error);
    });
    return;
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  getOrderInvoice,
};
