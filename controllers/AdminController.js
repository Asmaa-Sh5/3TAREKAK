const User = require("../models/user");
const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Admin login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) return res.status(404).send("Admin not found.");

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log(error);
      return res.status(400).send("Invalid credentials.");
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Approve or deny authentication request
exports.handleAuthenticationRequest = async (req, res) => {
  try {
    const { userId, action } = req.body; // action: 'approve' or 'deny'
    const user = await User.findById(userId);

    if (!user) return res.status(404).send("User not found.");

    if (action === "approve") {
      user.isAuthenticated = true;
    }
    if (action === "deny") {
      user.isAuthenticated = false;
    }
    // user.authenticationRequest.requested = false;
    // user.authenticationRequest.idphotoURL = "";
    // user.authenticationRequest.passportphotoURL = "";

    await user.save();

    res.status(200).send(`Authentication request ${action}d.`);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Delete user account
exports.deleteUserAccount = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    if (!user) return res.status(404).send("User not found.");

    res.status(200).send("User account deleted.");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
