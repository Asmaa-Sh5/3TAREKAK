const mongoose = require("mongoose");

const postSchema_sender = new mongoose.Schema({
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
  travelDate: {
    type: Date,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Post_sender = mongoose.model("Post_sender", postSchema_sender);

module.exports = Post_sender;
