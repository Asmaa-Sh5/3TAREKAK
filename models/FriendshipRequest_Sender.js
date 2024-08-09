const mongoose = require("mongoose");

const FriendshipRequestSchema_sender = new mongoose.Schema({
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
  takeLocation: {
    type: String,
    // state: String,
    // city: String,
    // street: String,
  },
  giveLocation: {
    type: String,
    // state: String,
    // city: String,
    // street: String,
  },
  takeDate: {
    type: Date,
  },
  takeTime: {
    type: String,
  },
  giveDate: {
    type: Date,
  },
  giveTime: {
    type: String,
  },
  price: {
    type: Map,
    of: Number,
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
});

const FriendshipRequest_sender = mongoose.model(
  "FriendshipRequest_sender",
  FriendshipRequestSchema_sender
);

module.exports = FriendshipRequest_sender;
