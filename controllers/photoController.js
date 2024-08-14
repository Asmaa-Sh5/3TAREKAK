// controllers/profileController.js

const multer = require("multer");
const path = require("path");
const User = require("../models/user");

// Set up storage for profile image uploads
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profile_images"); // Folder for profile images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-profile" + path.extname(file.originalname)); // Add timestamp
  },
});

// Set up storage for ID and Passport photo uploads
const authStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/auth_images"); // Folder for ID/passport images
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + "-" + file.fieldname + path.extname(file.originalname)
    ); // Name by fieldname (idPhoto or passportPhoto)
  },
});

// File filter for images only
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Please upload an image file."), false);
  }
};

// Multer setup for profile image
const uploadProfileImage = multer({
  storage: profileStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit 2MB
}).single("profileImage");

// Multer setup for ID and passport photo uploads
const uploadAuthImages = multer({
  storage: authStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit 2MB
}).fields([
  { name: "idphotoURL", maxCount: 1 }, // Single ID photo
  { name: "passportphotoURL", maxCount: 1 }, // Single Passport photo
]);

// Controller for profile image upload
exports.uploadProfileImage = async (req, res) => {
  uploadProfileImage(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).send({ message: "No profile image uploaded." });
    }

    try {
      const user = await User.findById(req.user._id);
      user.profileImageUrl = req.file.path; // Save path to profileImageUrl
      await user.save();

      res.status(200).send({
        message: "Profile image uploaded successfully!",
        imageUrl: req.file.path,
      });
    } catch (error) {
      res
        .status(500)
        .send({ message: "Server error, please try again later." });
    }
  });
};

// Controller for ID and passport photo upload
exports.requestAuthentication = async (req, res) => {
  uploadAuthImages(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    if (!req.files || !req.files.idphotoURL || !req.files.passportphotoURL) {
      return res
        .status(400)
        .send({ message: "Both ID and passport photos must be uploaded." });
    }

    try {
      const user = await User.findById(req.user._id);

      user.authenticationRequest.requested = true;
      user.authenticationRequest.idphotoURL = req.files.idphotoURL[0].path; // Save ID photo path
      user.authenticationRequest.passportphotoURL =
        req.files.passportphotoURL[0].path; // Save passport photo path

      await user.save();

      res.status(200).send({
        message: "Authentication request submitted successfully!",
        idPhotoURL: user.authenticationRequest.idphotoURL,
        passportPhotoURL: user.authenticationRequest.passportphotoURL,
      });
    } catch (error) {
      res
        .status(500)
        .send({ message: "Server error, please try again later." });
    }
  });
};
