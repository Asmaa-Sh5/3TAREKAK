const Post = require("../models/Post");
const Post_sender = require("../models/Post_sender");

const postsController = {
  createPost: async (req, res) => {
    try {
      const {
        kindOfThing,
        weight,
        source,
        target,
        description,
        takeLocation,
        giveLocation,
        takeDate,
        takeTime,
        giveDate,
        giveTime,
        travelDate,
        price,
      } = req.body;

      // // Validate input
      // if (
      //   !kindOfThing ||
      //   !weight ||
      //   !source ||
      //   !target ||
      //   !description
      // ) {
      //   return res
      //     .status(400)
      //     .json({ error: "Incomplete information provided" });
      // }

      const userId = req.user._id;

      const newPost = new Post({
        user: userId,
        kindOfThing,
        weight,
        description,
        location: {
          source,
          target,
        },
        takeLocation,
        giveLocation,
        takeDate,
        takeTime,
        giveDate,
        giveTime,
        travelDate,
        price,
      });

      const savedPost = await newPost.save();

      return res.status(201).json({ success: true, post: savedPost });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  createPost_Sender: async (req, res) => {
    try {
      const { kindOfThing, weight, source, target, description, travelDate } =
        req.body;

      const userId = req.user._id;

      const newPost = new Post_sender({
        user: userId,
        kindOfThing,
        weight,
        description,
        location: {
          source,
          target,
        },
        travelDate,
      });

      const savedPost = await newPost.save();

      return res.status(201).json({ success: true, post: savedPost });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getAllPosts: async (req, res) => {
    try {
      const posts = await Post.find()
        .populate("user", "name")
        .sort({ timestamp: -1 });
      res.json({ posts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getAllPosts_sender: async (req, res) => {
    try {
      const posts = await Post_sender.find()
        .populate("user", "name")
        .sort({ timestamp: -1 });
      res.json({ posts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getAllPostsForUser: async (req, res) => {
    try {
      const userId = req.user._id;
      const posts = await Post.find({ user: userId }).sort({ timestamp: -1 });

      res.json({ posts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getAllPostsForUser_sender: async (req, res) => {
    try {
      const userId = req.user._id;
      const posts = await Post_sender.find({ user: userId }).sort({
        timestamp: -1,
      });

      res.json({ posts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getPostDetails: async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.json({
        postId: post._id,
        kindOfThing: post.kindOfThing,
        availableWeight: post.weight,
        price: post.price,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getFilteredPosts: async (req, res) => {
    const { kindOfThing, weight, source, target, price } = req.query;

    try {
      const query = {};

      if (kindOfThing) {
        query.kindOfThing = { $regex: kindOfThing, $options: "i" };
      }

      if (weight) {
        query.weight = weight;
      }

      if (source) {
        query.source = { $regex: source, $options: "i" };
      }

      if (target) {
        query.target = { $regex: target, $options: "i" };
      }

      if (price) {
        query.price = price;
      }

      const posts = await Post.find(query);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updatePost: async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
      const post = await Post.findByIdAndUpdate(id, updates, { new: true });
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.status(200).json(post);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  },
  updatePost_sender: async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
      console.log(id);
      const post = await Post_sender.findByIdAndUpdate(id, updates, {
        new: true,
      });
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.status(200).json(post);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  },
  deletePost: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.findByIdAndDelete(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting post" });
    }
  },
  deletePost_sender: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post_sender.findByIdAndDelete(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting post" });
    }
  },
  deleteAllPost: async (req, res) => {
    try {
      await Post.deleteMany({});

      res.json({ message: "All Posts deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
  deleteAllPost_sender: async (req, res) => {
    try {
      await Post_sender.deleteMany({});

      res.json({ message: "All Posts deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = postsController;
