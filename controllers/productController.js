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

exports.productDelete = async (req, res, next) => {
  const foundshop = await Shop.findOne({
    where: {
      id: req.product.shopId,
    },
  });
  if (req.user.id === foundshop.userId) {
    await req.product.destroy();
    res.status(200).end();
  } else {
    next({
      status: 401,
      message: "You can't delete products from another user's shop !!",
    });
  }
};

exports.productUpdate = async (req, res, next) => {
  const foundshop = await Shop.findOne({
    where: {
      id: req.product.shopId,
    },
  });
  if (req.user.id === foundshop.userId) {
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
