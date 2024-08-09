const express = require("express");
const postsController = require("../controllers/postsController");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.post("/create", auth, postsController.createPost);
router.post("/create-sender", auth, postsController.createPost_Sender);
router.get("/show", auth, postsController.getAllPosts);
router.get("/show-sender", auth, postsController.getAllPosts_sender);
router.get("/showForUser", auth, postsController.getAllPostsForUser);
router.get(
  "/showForUser-sender",
  auth,
  postsController.getAllPostsForUser_sender
);
router.get("/post-details/:id", auth, postsController.getPostDetails);
router.get("/FilteredPosts", auth, postsController.getFilteredPosts);
router.put("/update/:id", auth, postsController.updatePost);
router.put("/update-sender/:id", auth, postsController.updatePost_sender);
router.delete("/deletePost/:id", auth, postsController.deletePost);
router.delete(
  "/deletePost-sender/:id",
  auth,
  postsController.deletePost_sender
);
router.delete("/deleteAllPost", auth, postsController.deleteAllPost);
router.delete(
  "/deleteAllPost-sender",
  auth,
  postsController.deleteAllPost_sender
);
module.exports = router;
