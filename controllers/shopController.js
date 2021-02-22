const { Shop } = require("../db/models");
const { Product } = require("../db/models");

exports.fetchShop = async (shopId, next) => {
  try {
    const foundShop = await Shop.findByPk(shopId);
    if (foundShop) return foundShop;
    else next({ message: "Shop does not exist" });
  } catch (error) {
    next(error);
  }
};

exports.shopList = async (req, res, next) => {
  try {
    const shops = await Shop.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },

      include: { model: Product, as: "products", attributes: ["id"] },
    });
    res.status(200).json(shops);
  } catch (error) {
    next(error);
  }
};

exports.shopDetail = async (req, res, next) => {
  res.status(200).json(req.shop);
};

exports.shopCreate = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
    }
    const newShop = await Shop.create(req.body);
    res.status(201).json(newShop);
  } catch (error) {
    next(error);
  }
};

exports.shopDelete = async (req, res) => {
  await req.shop.destroy();
  res.status(200).end();
};

exports.shopUpdate = async (req, res) => {
  if (req.file) {
    req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
  }
  await req.shop.update(req.body);
  res.status(200).json(req.shop);
};

exports.productCreate = async (req, res, next) => {
  try {
    req.body.shopId = req.shop.id;
    if (req.file) {
      req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
    }
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

exports.productUpdate = async (req, res) => {
  if (req.file) {
    req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
  }
  const re = await req.product.update(req.body);
  res.status(200).json(re);
};
