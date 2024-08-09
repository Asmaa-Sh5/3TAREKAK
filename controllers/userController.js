const userController = {
  // Request Authentication
  requestAuthentication: async (req, res) => {
    try {
      const { idphotoURL, passportphotoURL } = req.body;
      const user = await User.findById(req.user._id);

      if (!user) return res.status(404).send("User not found.");

      user.authenticationRequest.requested = true;
      user.authenticationRequest.idphotoURL = idphotoURL;
      user.authenticationRequest.passportphotoURL = passportphotoURL;
      await user.save();

      res.status(200).send("Authentication request sent.");
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
  getProfile: (req, res) => {
    res.json({
      isAuth: true,
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
    });
  },
};

module.exports = userController;
