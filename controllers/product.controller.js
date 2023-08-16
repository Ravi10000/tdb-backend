const Product = require("../models/product.model");

module.exports.createProduct = async (req, res, next) => {
  try {
    const { name, regularPrice, memberPrice, status } = req.body;
    const createdBy = req.user._id;
    const product = await Product.create({
      name,
      regularPrice,
      memberPrice,
      createdBy,
      status,
    });
    res.status(201).json({
      status: "success",
      message: "product created",
      product,
    });
  } catch (err) {
    next(err);
  }
};
module.exports.updateProduct = async (req, res, next) => {
  try {
    const { name, regularPrice, memberPrice, status, productId } = req.body;
    const product = await Product.findByIdAndUpdate(
      productId,
      {
        ...(name && { name }),
        ...(regularPrice && { regularPrice }),
        ...(memberPrice && { memberPrice }),
        ...(status && { status }),
      },
      { new: true }
    );
    if (!product)
      throw new Error("product not found", { cause: { status: 404 } });
    res.status(200).json({
      status: "success",
      message: "product updated",
      product,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.fetchProducts = async (req, res, next) => {
  try {
    const { status } = req.query;
    const products = await Product.find({ ...(status && { status }) });
    res.status(200).json({
      status: "success",
      message: "products found",
      products,
    });
  } catch (err) {
    next(err);
  }
};

// fetch product by id
module.exports.fetchProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product)
      throw new Error("product not found", { cause: { status: 404 } });
    res.status(200).json({
      status: "success",
      message: "product found",
      product,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByIdAndDelete(productId);
    console.log({ product });
    if (!product)
      throw new Error("product not found", { cause: { status: 404 } });
    res.status(200).json({
      status: "success",
      message: "product deleted",
    });
  } catch (err) {
    next(err);
  }
};
