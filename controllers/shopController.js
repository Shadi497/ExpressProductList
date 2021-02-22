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
    const foundshop = await Shop.findOne({
      where: {
        userId: req.user.id,
      },
    });
    if (foundshop) {
      next({
        status: 400,
        message: "You already have one shop !!",
      });
    } else {
      if (req.file) {
        req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
      }
      req.body.userId = req.user.id;
      const newShop = await Shop.create(req.body);
      res.status(201).json(newShop);
    }
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
    if (req.user.id === req.shop.userId) {
      req.body.shopId = req.shop.id;
      if (req.file) {
        req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
      }
      const newProduct = await Product.create(req.body);
      res.status(201).json(newProduct);
    } else {
      next({
        status: 401,
        message: "You can't add in another user's shop !!",
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.productDelete = async (req, res) => {
  if (req.user.id === req.shop.userId) {
    await req.product.destroy();
    res.status(200).end();
  } else {
    next({
      status: 401,
      message: "You can't delete products from another user's shop !!",
    });
  }
};

exports.productUpdate = async (req, res) => {
  if (req.user.id === req.shop.userId) {
    if (req.file) {
      req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
    }
    const re = await req.product.update(req.body);
    res.status(200).json(re);
  } else {
    next({
      status: 401,
      message: "You can't update products from another user's shop !!",
    });
  }
};
