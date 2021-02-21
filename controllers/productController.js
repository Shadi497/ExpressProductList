const { Product } = require("../db/models");
const { Shop } = require("../db/models");

exports.fetchProduct = async (productId, next) => {
  try {
    const foundProduct = await Product.findByPk(productId);
    if (foundProduct) return foundProduct;
    else next({ message: "Product does not exist" });
  } catch (error) {
    next(error);
  }
};

exports.productCreate = async (req, res, next) => {
  try {
    // req.body.shopId = req.shop.id;
    if (req.file) {
      req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
    }
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

exports.productList = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: { model: Shop, as: "shop", attributes: ["name"] },
    });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

exports.productDetail = async (req, res, next) => {
  res.status(200).json(req.product);
};

exports.productDelete = async (req, res) => {
  await req.product.destroy();
  res.status(200).end();
};

exports.productUpdate = async (req, res) => {
  if (req.file) {
    req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
  }
  await req.product.update(req.body);
  res.status(200).json(req.product);
};
