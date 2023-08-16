const { deleteFile } = require("../middlewares/image-upload.middleware");
const Product = require("../models/product.model");

module.exports.createProduct = async (req, res, next) => {
  try {
    const { name, regularPrice, memberPrice, status } = req.body;
    const image = req?.file?.filename;
    if (!image) throw new Error("image required", { cause: { status: 400 } });
    const createdBy = req.user._id;
    const product = await Product.create({
      name,
      regularPrice,
      memberPrice,
      createdBy,
      image,
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
    const image = req?.file?.filename;
    const oldProduct = await Product.findById(productId);
    if (!oldProduct) {
      throw new Error("product not sent", { cause: { status: 404 } });
    }
    const product = await Product.findByIdAndUpdate(
      productId,
      {
        ...(name && { name }),
        ...(regularPrice && { regularPrice }),
        ...(memberPrice && { memberPrice }),
        ...(status && { status }),
        ...(image && { image }),
      },
      { new: true }
    );
    if (!product)
      throw new Error("product not sent", { cause: { status: 404 } });
    deleteFile(oldProduct?.image);
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
      message: "products sent",
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
      throw new Error("product not sent", { cause: { status: 404 } });
    res.status(200).json({
      status: "success",
      message: "product sent",
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
      throw new Error("product not sent", { cause: { status: 404 } });
    res.status(200).json({
      status: "success",
      message: "product deleted",
    });
  } catch (err) {
    next(err);
  }
};
