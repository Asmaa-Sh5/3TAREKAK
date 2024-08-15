const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const User = require("../models/user");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Get from your Cloudinary dashboard
  api_key: process.env.CLOUDINARY_API_KEY, // Get from your Cloudinary dashboard
  api_secret: process.env.CLOUDINARY_API_SECRET, // Get from your Cloudinary dashboard
});

// Set up Cloudinary storage for profile image uploads
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile_images", // Folder to store profile images in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

// Set up Cloudinary storage for ID and passport photo uploads
const authStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "auth_images", // Folder to store ID and passport photos
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

// Multer setup for profile image
const uploadProfileImage = multer({
  storage: profileStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit 2MB
}).single("profileImage");

// Multer setup for ID and passport photo uploads
const uploadAuthImages = multer({
  storage: authStorage,
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
      user.profileImageUrl = req.file.path; // Cloudinary returns a URL path
      await user.save();

      res.status(200).send({
        message: "Profile image uploaded successfully!",
        imageUrl: req.file.path, // The Cloudinary URL
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

    // Log req.files to check if the files are being uploaded properly
    console.log("Uploaded files:", req.files);

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
        console.log("Saving ID photo...");
        user.authenticationRequest.idphotoURL = req.files.idphotoURL[0].path; // Cloudinary URL
      }

      // Save the passport photo if it was uploaded
      if (req.files.passportphotoURL) {
        console.log("Saving passport photo...");
        user.authenticationRequest.passportphotoURL =
          req.files.passportphotoURL[0].path; // Cloudinary URL
      }

      await user.save();

      // Respond based on which photo was uploaded
      if (req.files.idphotoURL) {
        console.log("Returning ID photo URL...");
        res.status(200).send({
          message: "Authentication request submitted successfully!",
          idPhotoURL: user.authenticationRequest.idphotoURL,
        });
      } else if (req.files.passportphotoURL) {
        console.log("Returning passport photo URL...");
        res.status(200).send({
          message: "Authentication request submitted successfully!",
          passportPhotoURL: user.authenticationRequest.passportphotoURL,
        });
      }
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
