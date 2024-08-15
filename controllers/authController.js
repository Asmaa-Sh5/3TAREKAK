const { sendOTP } = require("../utils/otp");
const { sendpassresetOTP } = require("../utils/otp");
const User = require("../models/user");
const { auth } = require("../middlewares/auth");

const authController = {
  register: async (req, res) => {
    const { name, email, password, password2 } = req.body;

    // Validate password match
    if (password !== password2) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    let query = { email: email };

    User.findOne(query).then(async (user) => {
      if (user) {
        return res.status(400).json({
          auth: false,
          message: "Email  already exists",
        });
      }

      // Generate OTP for new user
      const otpCode = Math.floor(1000 + Math.random() * 9000);
      console.log(otpCode);

      // Create a new User instance
      const newUser = new User({
        name: name,
        email: email,
        password: password,
        password2: password2,
        otp: otpCode, // Set OTP for the new user
      });

      try {
        // Send OTP to the user's email
        await sendOTP(email, otpCode);

        // Save the new user to the database
        const savedUser = await newUser.save();

        res.status(200).json({
          success: true,
          user: savedUser,
          message: "User registered successfully. Please verify OTP.",
        });
      } catch (error) {
        console.log(error);
        console.error(error);
        return res
          .status(500)
          .json({ success: false, message: "Failed to send OTP" });
      }
    });
  },

  login: (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    let query = { email: email };

    User.findOne(query)
      .then((user) => {
        if (!user) {
          return res.json({
            isAuth: false,
            message: "Authentication failed: User not found",
          });
        }

        user.comparepassword(password, (err, isMatch) => {
          if (!isMatch) {
            return res.status(401).json({
              isAuth: false,
              message: "Authentication failed: Password doesn't match",
            });
          }

          user.generateToken((err, user) => {
            if (err) {
              return res.status(500).json({
                error: true,
                message: "Internal Server Error",
              });
            }

            const token = user.token;
            console.log(token);
            res.json({
              isAuth: true,
              name: user.name,
              id: user._id,
              email: user.email,
              token: token,
            });
          });
        });
      })
      .catch((err) => {
        return res.status(500).json({
          error: true,
          message: "Internal Server Error",
        });
      });
  },

  verifyOTP: async (req, res) => {
    const { otp } = req.body;

    // const { email, otp } = req.body;
    const user = await User.findOne({ otp });
    // if (!user) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "User not found" });
    // }

    // Verify OTP
    if (otp === user.otp) {
      // Clear the OTP after successful verification
      user.otp = undefined;
      await user.save();

      return res
        .status(200)
        .json({ success: true, message: "OTP verification successful" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  },

  logout: (req, res) => {
    req.user.deleteToken(req.token, (err, user) => {
      if (err) return res.status(400).send(err);
      res.sendStatus(200);
    });
  },

  forgetpass: async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }
    const RspassOTP = Math.floor(1000 + Math.random() * 9000);
    console.log(RspassOTP);
    await User.findOneAndUpdate({ email }, { resetpassOtp: RspassOTP });

    try {
      // Send resetpassOTP to the user's email
      await sendpassresetOTP(email, RspassOTP);

      res.status(200).json({
        success: true,
        message: "The password reset code has been sent,pleas enter it.",
      });
    } catch (error) {
      console.log(error);
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to send password reset code",
      });
    }
  },

  resetpass: async (req, res) => {
    const { email, password, password2 } = req.body;
    if (password !== password2) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    user.password = password;
    user.password2 = password2;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  },

  verifyResetPassOtp: async (req, res) => {
    {
      const { resetpassOtp } = req.body;

      const user = await User.findOne({ resetpassOtp });

      // Verify OTP
      if (resetpassOtp === user.resetpassOtp) {
        // Clear the OTP after successful verification
        user.resetpassOtp = undefined;
        await user.save();

        return res.status(200).json({
          success: true,
          message: "ResetPassOtp verification successful",
        });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Invalid ResetPassOtp" });
      }
    }
  },
  resendOTP: async (req, res) => {
    const { email } = req.body; // Assuming email is passed in the request body

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    try {
      // Generate a new OTP
      const newOtpCode = Math.floor(1000 + Math.random() * 9000);
      console.log(newOtpCode);

      // Update the user's OTP
      user.otp = newOtpCode;
      await user.save();

      // Resend the OTP using the sendOTP utility function
      await sendOTP(user.email, newOtpCode);

      res.status(200).json({
        success: true,
        message: "OTP resent successfully. Please check your email.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to resend OTP",
      });
    }
  },
};
module.exports = authController;
