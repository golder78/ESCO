const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Add product to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        products: [],
      });
    }

    const existingProduct =
      cart.products.find(
        (item) =>
          item.product.toString() === productId
      );

    if (existingProduct) {
      existingProduct.quantity +=
        quantity || 1;
    } else {
      cart.products.push({
        product: productId,
        quantity: quantity || 1,
      });
    }

    let total = 0;

    for (const item of cart.products) {
      const prod = await Product.findById(
        item.product
      );

      total += prod.price * item.quantity;
    }

    cart.total = total;

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get logged-in user's cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("products.product");

    if (!cart) {
      return res.status(200).json({
        products: [],
        total: 0,
      });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Remove product from cart
const removeFromCart = async (
  req,
  res
) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.products = cart.products.filter(
      (item) =>
        item.product.toString() !== productId
    );

    let total = 0;

    for (const item of cart.products) {
      const product =
        await Product.findById(
          item.product
        );

      total +=
        product.price * item.quantity;
    }

    cart.total = total;

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.products = [];
    cart.total = 0;

    await cart.save();

    res.status(200).json({
      message: "Cart cleared",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
};