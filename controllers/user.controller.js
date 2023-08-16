const User = require("../models/user.model");

module.exports.fetchUsers = async (req, res, next) => {
  try {
    const { usertype } = req.query;
    const users = await User.find({ ...(usertype && { usertype }) });
    res.status(200).json({
      status: "success",
      message: "users sent",
      users,
    });
  } catch (err) {
    next(err);
  }
};
