const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/user");

// Function to ensure directory exists
const ensureDirectoryExistence = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

// Set up storage for profile image uploads
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/profile_images";
    ensureDirectoryExistence(uploadDir); // Ensure the directory exists
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-profile" + path.extname(file.originalname)); // Add timestamp
  },
});

// Set up storage for ID and Passport photo uploads
const authStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/auth_images";
    ensureDirectoryExistence(uploadDir); // Ensure the directory exists
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + "-" + file.fieldname + path.extname(file.originalname)
    ); // Name by fieldname
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
  { name: "idphotoURL", maxCount: 1 },
  { name: "passportphotoURL", maxCount: 1 },
]);

// Controller for profile image upload
const uploadProfileImageController = (req, res) => {
  uploadProfileImage(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).send({ message: "No profile image uploaded." });
    }

    try {
      const user = await User.findById(req.user._id);
      user.profileImageUrl = req.file.path;
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

// Controller for ID or passport photo upload (only one allowed)
const requestAuthenticationController = (req, res) => {
  uploadAuthImages(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    // Ensure that only one of the fields is uploaded
    if (req.files.idphotoURL && req.files.passportphotoURL) {
      return res.status(400).send({
        message:
          "Please upload only one image: either an ID photo or a passport photo.",
      });
    }

    if (!req.files.idphotoURL && !req.files.passportphotoURL) {
      return res.status(400).send({
        message: "Please upload either an ID photo or a passport photo.",
      });
    }

    try {
      const user = await User.findById(req.user._id);
      user.authenticationRequest.requested = true;

      // Save the ID photo if it was uploaded
      if (req.files.idphotoURL) {
        user.authenticationRequest.idphotoURL = req.files.idphotoURL[0].path;
      }

      // Save the passport photo if it was uploaded
      if (req.files.passportphotoURL) {
        user.authenticationRequest.passportphotoURL =
          req.files.passportphotoURL[0].path;
      }

      await user.save();
      if (idPhotoURL==null)
        res.status(200).send({
          message: "Authentication request submitted successfully!",
          passportPhotoURL: user.authenticationRequest.passportphotoURL ,
        } );
      if ( passportPhotoURL == null )
        res.status(200).send({
          message: "Authentication request submitted successfully!",
          idPhotoURL: user.authenticationRequest.idphotoURL ,
        });
    } catch (error) {
      res
        .status(500)
        .send({ message: "Server error, please try again later." });
    }
  });
};

const userController = {
  getProfile: (req, res) => {
    res.json({
      isAuth: true,
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      profileImageUrl: req.user.profileImageUrl,
    });
  },
  uploadProfileImage: uploadProfileImageController,
  requestAuthentication: requestAuthenticationController,
};

module.exports = userController;
