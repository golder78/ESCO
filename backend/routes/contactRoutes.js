const express = require("express");

const {
  submitContact,
  getContacts,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

const router = express.Router();

// Public route - anyone can submit
router.post("/", submitContact);

// Admin routes
router.get("/", protect, admin, getContacts);

router.put("/:id", protect, admin, updateContact);

router.delete("/:id", protect, admin, deleteContact);

module.exports = router;
