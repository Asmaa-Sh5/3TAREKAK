const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const { auth } = require("../middlewares/auth");

const router = express.Router();
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/verify-otp", authController.verifyOTP);
router.get("/logout", auth, authController.logout);
router.post(
  "/request-authentication",
  auth,
  userController.requestAuthentication
);
router.post("/forgetpass", authController.forgetpass);
router.post("/resetpass", authController.resetpass);
router.post("/verifyResetPassOtp", authController.verifyResetPassOtp);
router.post("/resend-otp", authController.resendOTP);

module.exports = router;
