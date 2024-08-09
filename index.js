const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const db = require("./config/config").get(process.env.NODE_ENV);
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postsRoutes = require("./routes/postsRoutes");
const FriendshipRoutes = require("./routes/FriendshipRequestRoutes");
const AdminRoutes = require("./routes/AdminRoutes");
const app = express();
// app use
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// database connection
mongoose.Promise = global.Promise;
mongoose.connect(db.DATABASE).then(() => {
  console.log("database is connected");
});

app.get("/", function (req, res) {
  res.status(200).send(`Welcome to api`);
});
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allowing requests from any origin
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/friendshipRequest", FriendshipRoutes);
app.use("/api/admin", AdminRoutes);

// listening port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`app is live at ${PORT}`);
});
