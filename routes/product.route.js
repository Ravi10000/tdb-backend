const express = require("express");
const {
  createProduct,
  updateProduct,
  fetchProducts,
  fetchProductById,
  deleteProduct,
} = require("../controllers/product.controller");
const { isUser, isAdmin } = require("../middlewares/auth.middleware");
const { body, query, param } = require("express-validator");
const validateReq = require("../middlewares/validate-req");
const {
  imageUpload,
  handleMulterError,
} = require("../middlewares/image-upload.middleware");

const router = express.Router();
router.post(
  "/",
  isUser,
  isAdmin,
  imageUpload.single("image"),
  handleMulterError,
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
  validateReq.withImage,
  createProduct
);
router.put(
  "/",
  isUser,
  isAdmin,
  imageUpload.single("image"),
  handleMulterError,
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
  validateReq.withImage,
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

router.delete(
  "/:productId",
  isUser,
  isAdmin,
  param("productId").isMongoId().withMessage("invalid product id"),
  validateReq,
  deleteProduct
);
module.exports = router;
