const FriendshipRequest = require("../models/FriendshipRequest");
const FriendshipRequest_sender = require("../models/FriendshipRequest_Sender");
const Post = require("../models/Post");

const requestController = {
  sendFriendshipRequest: async (req, res) => {
    try {
      const { postId, selectedItems, weight, amount, totalprice } = req.body;
      const requestTime = new Date();

      const sender = req.user._id;
      // The current user is the sender

      // Validate the post
      const post = await Post.findById(postId);
      if (!post) {
        return res
          .status(400)
          .json({ message: `Post with ID ${postId} not found` });
      }
      const receiver = post.user;
      // Validate weight and calculate total price
      // if (post.weight < weight) {
      //   return res.status(400).json({
      //     message: `Insufficient weight available for post ID ${postId}`,
      //   });
      // }

      // // Calculate the total price based on the weight
      // //   const totalPrice = post.price * weight;

      // Create the new friendship request
      const newFriendRequest = new FriendshipRequest({
        sender,
        receiver,
        postId,
        selectedItems,
        weight,
        totalprice,
        status: "pending",
        amount,
        requestTime,
      });
      const savedRequest = await newFriendRequest.save();

      res.status(200).json({
        message: "Friend request sent successfully",
        request: savedRequest,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error sending friend request" });
    }
  },
  sendFriendshipRequest_sender: async (req, res) => {
    try {
      const {
        postId,
        takeLocation,
        giveLocation,
        takeDate,
        takeTime,
        giveDate,
        giveTime,
        price,
      } = req.body;
      const requestTime = new Date();

      const sender = req.user._id;
      // The current user is the sender

      // Validate the post
      const post = await Post.findById(postId);
      if (!post) {
        return res
          .status(400)
          .json({ message: `Post with ID ${postId} not found` });
      }
      const receiver = post.user;

      // Create the new friendship request
      const newFriendRequest1 = new FriendshipRequest_sender({
        sender,
        receiver,
        postId,
        takeLocation,
        giveLocation,
        takeDate,
        takeTime,
        giveDate,
        giveTime,
        price,
        status: "pending",
        requestTime,
      });
      const savedRequest1 = await newFriendRequest1.save();

      res.status(200).json({
        message: "Friend request sent successfully",
        request: savedRequest1,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error sending friend request" });
    }
  },

  getReceivedRequests: async (req, res) => {
    try {
      const userId = req.user._id;
      const requests = await FriendshipRequest.find({ receiver: userId })
        .populate("sender", "name email")
        .populate("postId");

      res.json(requests);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching requests" });
    }
  },
  getReceivedRequests_sender: async (req, res) => {
    try {
      const userId = req.user._id;
      const requests = await FriendshipRequest_sender.find({ receiver: userId })
        .populate("sender", "name email")
        .populate("postId");

      res.json(requests);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching requests" });
    }
  },
  getSentRequests: async (req, res) => {
    try {
      const userId = req.user._id;
      const requests = await FriendshipRequest.find({
        sender: userId,
      }).populate("receiver", "name");
      res.status(200).json({ requests });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching sent requests" });
    }
  },
  getSentRequests_sender: async (req, res) => {
    try {
      const userId = req.user._id;
      const requests = await FriendshipRequest_sender.find({
        sender: userId,
      }).populate("receiver", "name");
      res.status(200).json({ requests });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching sent requests" });
    }
  },
  acceptRequest: async (req, res) => {
    try {
      const requestId = req.params.id;
      const request = await FriendshipRequest.findById(requestId).populate(
        "postId"
      );

      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      // Update the weight of the post
      const post = request.postId;
      if (post.weight < request.weight) {
        return res
          .status(400)
          .json({ message: "Not enough weight available." });
      }
      post.weight -= request.weight;
      await post.save();

      request.status = "accepted";
      await request.save();

      res.json({ message: "Request accepted", request }); //
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error accepting request" });
    }
  },
  acceptRequest_sender: async (req, res) => {
    try {
      const requestId = req.params.id;
      const request = await FriendshipRequest_sender.findById(
        requestId
      ).populate("postId");

      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      request.status = "accepted";
      await request.save();

      res.json({ message: "Request accepted", request }); //
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error accepting request" });
    }
  },

  rejectRequest: async (req, res) => {
    try {
      const requestId = req.params.id;
      const request = await FriendshipRequest.findById(requestId);

      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      request.status = "rejected";
      await request.save();

      res.json({ message: "Request rejected", request });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error rejecting request" });
    }
  },
  rejectRequest_sender: async (req, res) => {
    try {
      const requestId = req.params.id;
      const request = await FriendshipRequest_sender.findById(requestId);

      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      request.status = "rejected";
      await request.save();

      res.json({ message: "Request rejected", request });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error rejecting request" });
    }
  },
  deleteRequest: async (req, res) => {
    try {
      const requestId = req.params.id;
      const request = await FriendshipRequest.findByIdAndDelete(requestId);

      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      res.json({ message: "Request deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error deleting request" });
    }
  },
  deleteRequest_sender: async (req, res) => {
    try {
      const requestId = req.params.id;
      const request = await FriendshipRequest_sender.findByIdAndDelete(
        requestId
      );

      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      res.json({ message: "Request deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error deleting request" });
    }
  },
  deleteAllRequests: async (req, res) => {
    try {
      const userId = req.user._id;
      await FriendshipRequest.deleteMany({ receiver: userId });

      res.json({ message: "All requests deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error deleting all requests" });
    }
  },
  deleteAllRequests_sender: async (req, res) => {
    try {
      const userId = req.user._id;
      await FriendshipRequest_sender.deleteMany({ receiver: userId });

      res.json({ message: "All requests deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error deleting all requests" });
    }
  },
};

module.exports = requestController;
