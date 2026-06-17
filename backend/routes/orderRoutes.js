const express = require("express");

const {
  createOrder,
  initiatePayment,
  paymentCallback,
  getOrders,
  getOrder,
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Create order (protected)
router.post("/", protect, createOrder);

// Initiate M-Pesa payment (protected)
router.post("/:id/pay", protect, initiatePayment);

// Daraja callback (public - no auth)
router.post("/callback", paymentCallback);

// Get user's orders (protected)
router.get("/", protect, getOrders);

// Get specific order (protected)
router.get("/:id", protect, getOrder);

module.exports = router;
