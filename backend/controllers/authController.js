const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const generateEmailToken = require("../utils/generateEmailToken");
const { sendWelcomeEmail } = require("../services/emailService");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } =
      req.body;

    const userExists = await User.findOne({
      email,
    });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const { token: verificationToken, expires: verificationExpires } = generateEmailToken();

    const user = await User.create({
      name,
      email,
      password,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });

    if (user) {
      console.log ("Sending welcome email to:", user.email);
      const result = await sendWelcomeEmail(user, verificationToken);

      if(result) {
        return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
      } else {
        res.status(409).json({
          message: "Error sending welcome message"
        })
      }

      
    }

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } =
      req.body;

    const user = await User.findOne({
      email,
    });

    if (
      user &&
      (await user.matchPassword(password))
    ) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  res.json(req.user);
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};