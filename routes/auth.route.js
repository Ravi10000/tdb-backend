const express = require("express");
const {
  registerUserWithEmail,
  verifyUserEmail,
  loginUserEmail,
  fetchProfile,
} = require("../controllers/auth.controller");
const { body } = require("express-validator");
const validateReq = require("../middlewares/validate-req");
const { isUser } = require("../middlewares/auth.middleware");
const router = express.Router();

router.post(
  "/register",
  [
    body("firstName").notEmpty().withMessage("first name required"),
    body("lastName").notEmpty().withMessage("last name required"),
    body("email")
      .isEmail()
      .withMessage("invalid email address")
      .notEmpty()
      .withMessage("email required"),
    body("password").notEmpty().withMessage("password required"),
  ],
  validateReq,
  registerUserWithEmail
);
router.post(
  "/verify",
  [
    body("email")
      .isEmail()
      .withMessage("invalid email address")
      .notEmpty()
      .withMessage("email required"),
    body("otp")
      .isLength({ max: 6, min: 6 })
      .withMessage("otp length should be 6 digits")
      .isNumeric()
      .withMessage("invalid otp")
      .notEmpty()
      .withMessage("otp required"),
  ],
  validateReq,
  verifyUserEmail
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("invalid email address")
      .notEmpty()
      .withMessage("email required"),
    body("password").notEmpty().withMessage("password required"),
  ],
  validateReq,
  loginUserEmail
);

router.get("/profile", isUser, fetchProfile);

module.exports = router;
