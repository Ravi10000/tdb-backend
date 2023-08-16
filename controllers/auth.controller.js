const bcrypt = require("bcrypt");
const { customOtpGen } = require("otp-gen-agent");

const User = require("../models/user.model");
const VerificationRequest = require("../models/verification-request.model");

const { generateOTP } = require("../utils/generate-otp");
const { generateToken } = require("../utils/generate-token");

module.exports.registerUserWithEmail = async (req, res, next) => {
  const { email, firstName, lastName, password } = req.body;
  try {
    let userExists = await User.exists({ email });
    if (userExists) throw new Error("user exists", { cause: { status: 400 } });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, firstName, lastName, hash: hashedPassword });
    const otp = await generateOTP(email);
    console.log({ otp });
    // TODO: send otp to email

    res.status(200).json({
      status: "success",
      message: "otp sent",
    });
  } catch (err) {
    next(err);
  }
};

module.exports.verifyUserEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const verificationRequest = await VerificationRequest.findOne({
      email,
    }).sort({ createdAt: -1 });
    if (!verificationRequest)
      throw new Error("invalid request", { cause: { status: 400 } });

    const isMatch = await bcrypt.compare(otp, verificationRequest.hashedOTP);
    if (!isMatch) throw new Error("incorrect otp", { cause: { status: 400 } });

    if (verificationRequest.isUsed)
      throw new Error("otp used", { cause: { status: 400 } });

    const isOtpExpired =
      Date.now().valueOf() - verificationRequest.createdAt.valueOf() > 6_00_000; // 10 minutes
    if (isOtpExpired)
      throw new Error("otp expired", { cause: { status: 400 } });

    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    ).select("-hash -createdAt -updatedAt -__v");
    console.log({ user });

    verificationRequest.isUsed = true;
    await verificationRequest.save();

    const accessToken = generateToken(user);
    return res.status(200).json({
      status: "success",
      message: "otp verified",
      accessToken,
      user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.loginUserEmail = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select(
      "-createdAt -updatedAt -__v"
    );
    if (!user) throw new Error("incorrect email", { cause: { status: 400 } });

    const isMatch = await bcrypt.compare(password, user.hash);
    if (!isMatch)
      throw new Error("incorrect password", { cause: { status: 400 } });

    if (!user.isVerified) {
      // TODO: send otp to email
      const otp = await generateOTP(email);
      console.log({ otp });
      return res
        .status(200)
        .json({ status: "success", message: "verification pending" });
    }

    const accessToken = generateToken(user);
    delete user._doc.hash;
    return res.status(200).json({
      status: "success",
      message: "login successful",
      accessToken,
      user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.fetchProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-hash -__v -updatedAt -createdAt"
    );
    if (!user) throw new Error("user not sent", { cause: { status: 404 } });
    const accessToken = generateToken(user);
    return res.status(200).json({
      status: "success",
      message: "user sent",
      accessToken,
      user,
    });
  } catch (err) {
    next(err);
  }
};
