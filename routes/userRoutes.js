const express = require("express");
const userController = require("../controllers/userController");
const { auth } = require("../middlewares/auth");

const router = express.Router();
router.get("/profile", auth, userController.getProfile);
router.post("/upload-profile-image", auth, userController.uploadProfileImage);
module.exports = router;
