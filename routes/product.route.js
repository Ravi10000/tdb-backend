const express = require("express");
const {
  createProduct,
  updateProduct,
  fetchProducts,
  fetchProductById,
} = require("../controllers/product.controller");
const { isUser, isAdmin } = require("../middlewares/auth.middleware");
const { body, query, param } = require("express-validator");
const validateReq = require("../middlewares/validate-req");

const router = express.Router();
router.post(
  "/",
  isUser,
  isAdmin,
  [
    body("name").notEmpty().withMessage("product name required"),
    body("regularPrice")
      .isNumeric()
      .withMessage("invalid regular price")
      .notEmpty()
      .withMessage("product price required"),
    body("memberPrice")
      .isNumeric()
      .withMessage("invalid member price")
      .notEmpty()
      .withMessage("price for members required"),
    body("status")
      .isIn(["active", "inactive"])
      .withMessage("invalid status, must be active or inactive")
      .notEmpty()
      .withMessage("status required"),
  ],
  validateReq,
  createProduct
);
router.put(
  "/",
  isUser,
  isAdmin,
  [
    body("productId")
      .isMongoId()
      .withMessage("invalid product id")
      .notEmpty()
      .withMessage("product id required"),
    body("regularPrice")
      .optional()
      .isNumeric()
      .withMessage("invalid regular price"),
    body("memberPrice")
      .optional()
      .isNumeric()
      .withMessage("invalid member price"),
    body("status")
      .optional()
      .isIn(["active", "inactive"])
      .withMessage("invalid status, must be active or inactive"),
  ],
  validateReq,
  updateProduct
);

router.get(
  "/:productId",
  param("productId").isMongoId().withMessage("invalid product id"),
  validateReq,
  fetchProductById
);
router.get(
  "/",
  query("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("invalid status, must be active or inactive"),
  validateReq,
  fetchProducts
);

module.exports = router;
