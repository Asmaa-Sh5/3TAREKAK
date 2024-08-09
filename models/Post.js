const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  kindOfThing: {
    type: Array,
  },
  weight: {
    type: Number,
  },
  description: {
    type: String,
  },
  location: {
    source: {
      country: String,
      state: String,
      city: String,
    },
    target: {
      country: String,
      state: String,
      city: String,
    },
  },
  takeLocation: {
    type: String,
    // state: String,
    // city: String,
    // street: String,
  },
  giveLocation: {
    type: String, // state: String,
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
  travelDate: {
    type: Date,
  },
  price: {
    type: Map,
    of: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
