const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const paymentService = require("../services/paymentService");

const createOrder = async (req, res) => {
  try {
    const { shippingAddress, phoneNumber } = req.body;
    const userId = req.user._id;

    if (!shippingAddress) {
      return res.status(400).json({
        message: "Shipping address is required",
      });
    }

    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const orderProducts = cart.products.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const totalAmount = cart.products.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    const order = await Order.create({
      user: userId,
      products: orderProducts,
      totalAmount,
      shippingAddress,
    });

    res.status(201).json({
      message: "Order created successfully",
      order: {
        _id: order._id,
        totalAmount: order.totalAmount,
        paymentStatus: order.paymentStatus,
        phoneNumber,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const initiatePayment = async (req, res) => {
  try {
    const { orderId, phoneNumber } = req.body;
    const userId = req.user._id;

    if (!orderId || !phoneNumber) {
      return res.status(400).json({
        message: "Order ID and phone number are required",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    if (order.paymentStatus === "Paid") {
      return res.status(400).json({
        message: "Order already paid",
      });
    }

    const formattedPhone =
      phoneNumber.startsWith("+254")
        ? phoneNumber.replace("+254", "254")
        : phoneNumber.startsWith("0")
        ? "254" + phoneNumber.substring(1)
        : "254" + phoneNumber;

    const paymentResponse = await paymentService.initiateSTKPush(
      formattedPhone,
      order.totalAmount,
      orderId,
      `Order-${orderId}`
    );

    if (paymentResponse.success) {
      order.mpesaTransactionRef = paymentResponse.checkoutRequestId;
      await order.save();

      return res.json({
        success: true,
        checkoutRequestId: paymentResponse.checkoutRequestId,
        customerMessage: paymentResponse.customerMessage,
        message: "Payment prompt sent to your phone",
      });
    } else {
      return res.status(400).json({
        success: false,
        message:
          paymentResponse.customerMessage ||
          "Failed to initiate payment",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const paymentCallback = async (req, res) => {
  try {
    const callbackData = req.body;

    const validation = paymentService.validateCallback(callbackData);

    if (!validation.success) {
      console.log("Payment failed:", validation);

      const checkoutRequestId =
        callbackData.Body?.stkCallback?.CheckoutRequestID;
      if (checkoutRequestId) {
        await Order.updateOne(
          { mpesaTransactionRef: checkoutRequestId },
          { paymentStatus: "Failed" }
        );
      }

      return res.json({
        ResultCode: 1,
        ResultDesc: "Failed",
      });
    }

    const checkoutRequestId =
      callbackData.Body?.stkCallback?.CheckoutRequestID;

    const order = await Order.findOneAndUpdate(
      { mpesaTransactionRef: checkoutRequestId },
      {
        paymentStatus: "Paid",
        mpesaTransactionRef: validation.transactionId,
      },
      { new: true }
    );

    if (order) {
      const cart = await Cart.findOne({ user: order.user });
      if (cart) {
        cart.products = [];
        cart.total = 0;
        await cart.save();
      }

      console.log(`Payment successful for order ${order._id}`);
    }

    res.json({
      ResultCode: 0,
      ResultDesc: "Success",
    });
  } catch (error) {
    console.error("Error processing callback:", error.message);
    res.json({
      ResultCode: 1,
      ResultDesc: "Error",
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId })
      .populate("products.product", "name image price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(id).populate(
      "products.product",
      "name image price"
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  initiatePayment,
  paymentCallback,
  getOrders,
  getOrder,
};
