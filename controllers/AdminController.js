const User = require("../models/user");
const Admin = require("../models/admin"); // Changed to Admin to avoid naming conflict
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config"); // Import the config module

// Get the current environment configuration
const envConfig = config.get(process.env.NODE_ENV || "default");
const JWT_SECRET = envConfig.SECRET;

// Admin login
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) return res.status(404).send("Admin not found.");

    // Use bcryptjs to compare passwords
    bcryptjs.compare(password, admin.password, (err, isMatch) => {
      if (err) return res.status(500).send("Server error");

      if (!isMatch) {
        return res.status(401).json({
          isAuth: false,
          message: "Authentication failed: Password doesn't match",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: admin._id, email: admin.email },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({ token });
    });
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
    } else if (action === "deny") {
      user.isAuthenticated = false;
    }

    // Clear authentication request data if needed
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
