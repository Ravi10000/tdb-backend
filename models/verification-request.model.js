const mongoose = require("mongoose");

const verificationRequestSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    hashedOTP: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const VerificationRequest = mongoose.model(
  "VerificationRequest",
  verificationRequestSchema
);
module.exports = VerificationRequest;
