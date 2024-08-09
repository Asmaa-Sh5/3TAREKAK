const mongoose = require("mongoose");

const FriendshipRequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  selectedItems: {
    type: Array,
  },
  weight: {
    type: Number,
  },
  totalprice: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  requestTime: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Map,
    of: Number,
  },
});

const FriendshipRequest = mongoose.model(
  "FriendshipRequest",
  FriendshipRequestSchema
);

module.exports = FriendshipRequest;
