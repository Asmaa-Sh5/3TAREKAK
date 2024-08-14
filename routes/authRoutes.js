const express = require("express");
const authController = require( "../controllers/authController" );
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

module.exports = router;
