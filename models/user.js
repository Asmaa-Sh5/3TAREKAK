var mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const confiq = require("../config/config").get(process.env.NODE_ENV);
const salt = 10;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  password2: {
    type: String,
    required: true,
    minlength: 8,
  },
  isAuthenticated: { type: Boolean, default: false },
  authenticationRequest: {
    requested: { type: Boolean, default: false },
    idphotoURL: { type: String, default: "" },
    passportphotoURL: { type: String, default: "" },
  },

  token: {
    type: String,
  },
  otp: {
    type: String,
  },
});

userSchema.pre("validate", function (next) {
  if (!this.email) {
    this.invalidate("email", "Email is required.");
  }
  next();
});
userSchema.pre("save", function (next) {
  var user = this;

  if (user.isModified("password")) {
    bcryptjs.genSalt(salt, function (err, salt) {
      if (err) return next(err);

      bcryptjs.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        user.password2 = hash;
        next();
      });
    });
  } else {
    next();
  }
});
userSchema.methods.comparepassword = function (password, cb) {
  bcryptjs.compare(password, this.password, function (err, isMatch) {
    if (err) return cb(next);
    cb(null, isMatch);
  });
};
// generate token

userSchema.methods.generateToken = function (cb) {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), confiq.SECRET);

  user.token = token;
  return user
    .save()
    .then((user) => {
      return cb(null, user);
    })
    .catch((err) => {
      return cb(err);
    });
};

// find by token

userSchema.statics.findByToken = function (token, cb) {
  const User = this;

  if (!token) {
    return cb("Token not provided");
  }

  jwt.verify(token, confiq.SECRET, function (err, decode) {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return cb("Token expired");
      } else {
        return cb("Invalid token");
      }
    }

    User.findOne({ _id: decode, token: token })
      .exec()
      .then((user) => {
        if (!user) {
          return cb("User not found");
        }
        cb(null, user);
      })
      .catch((err) => {
        cb(`Error finding user: ${err}`);
      });
  });
};

// delete token
userSchema.methods.deleteToken = function (token, cb) {
  var user = this;

  user
    .updateOne({ $unset: { token: 1 } })
    .exec()
    .then((user) => {
      cb(null, user);
    })
    .catch((err) => {
      cb(err);
    });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
