const express = require("express");

const {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const {protect} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getCart);

router.post("/", protect, addToCart);

router.delete(
  "/:productId",
  protect,
  removeFromCart
);

router.delete(
  "/clear/all",
  protect,
  clearCart
);

module.exports = router;