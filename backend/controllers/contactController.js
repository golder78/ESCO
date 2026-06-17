const Contact = require("../models/Contact");
const { sendContactNotification } = require("../services/emailService");

const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Please provide name, email, and message",
      });
    }

    const contact = await Contact.create({
      name,
      email,
      message,
    });

    await sendContactNotification(contact);

    return res.status(201).json({
      message: "Thank you for contacting us! We'll get back to you soon.",
      contact: {
        _id: contact._id,
        name: contact.name,
        email: contact.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({
      createdAt: -1,
    });

    res.json(contacts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    if (status) contact.status = status;
    if (adminNotes) contact.adminNotes = adminNotes;

    const updatedContact = await contact.save();

    res.json({
      message: "Contact updated",
      contact: updatedContact,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    await contact.deleteOne();

    res.json({
      message: "Contact deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  submitContact,
  getContacts,
  updateContact,
  deleteContact,
};
