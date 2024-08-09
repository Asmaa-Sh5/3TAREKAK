const express = require("express");
const router = express.Router();
const {
  adminLogin,
  getAllUsers,
  handleAuthenticationRequest,
  deleteUserAccount,
} = require("../controllers/AdminController");
const adminAuthMiddleware = require("../middlewares/adminAuthMiddleware");

router.post("/login", adminLogin);
router.get("/users", getAllUsers);
router.post(
  "/handle-authentication",

  handleAuthenticationRequest
);
router.delete("/user/:userId", deleteUserAccount);

module.exports = router;
