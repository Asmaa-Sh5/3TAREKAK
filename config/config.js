const config = {
  production: {
    SECRET: process.env.SECRET,
    DATABASE: process.env.MONGODB_URI,
  },
  default: {
    SECRET: "mysecretkey",
    DATABASE: "mongodb://0.0.0.0:27017/3TAREKAK",
  },
};

exports.get = function get(env) {
  return config[env] || config.default;
};
