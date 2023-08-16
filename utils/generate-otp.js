const { customOtpGen } = require("otp-gen-agent");
const VerificationRequest = require("../models/verification-request.model");
const bcrypt = require("bcrypt");

module.exports.generateOTP = async (email) => {
  const otp = await customOtpGen({ length: 6, chars: "0123456789" });
  const hashedOTP = await bcrypt.hash(otp, 10);
  try {
    await VerificationRequest.create({
      email,
      hashedOTP,
    });
    return otp;
  } catch (err) {
    console.log(err);
  }
};
