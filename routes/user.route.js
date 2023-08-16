const express = require("express");
const { query } = require("express-validator");

const validateReq = require("../middlewares/validate-req");
const { isUser, isAdmin } = require("../middlewares/auth.middleware");
const { fetchUsers } = require("../controllers/user.controller");

const router = express.Router();

router.get(
  "/",
  isUser,
  isAdmin,
  query("usertype")
    .optional()
    .isIn(["admin", "user"])
    .withMessage("invalid usertype, accepted values are admin or user"),
  validateReq,
  fetchUsers
);

module.exports = router;
