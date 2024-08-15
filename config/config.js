const config = {
  production: {
    SECRET: process.env.SECRET, // JWT Secret or any other secret key
    DATABASE: process.env.MONGODB_URI, // MongoDB URI for production
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary cloud name
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY, // Cloudinary API key
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET, // Cloudinary API secret
    // PORT: process.env.PORT || 3000, // Port for production
  },
  default: {
    SECRET: "mysecretkey", // Default JWT secret key (for development)
    DATABASE: "mongodb://0.0.0.0:27017/3TAREKAK", // Local MongoDB for development
    // CLOUDINARY_CLOUD_NAME: "your_cloud_name_here", // Replace with your Cloudinary cloud name for dev
    // CLOUDINARY_API_KEY: "your_api_key_here", // Replace with your Cloudinary API key for dev
    // CLOUDINARY_API_SECRET: "your_api_secret_here", // Replace with your Cloudinary API secret for dev
    // PORT: 3000, // Default port for development
  },
};

// Function to get the appropriate configuration based on environment
exports.get = function get(env) {
  return config[env] || config.default;
};
