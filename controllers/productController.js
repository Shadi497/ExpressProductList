const { Product } = require("../db/models");

exports.productList = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.productDetail = async (req, res) => {
  const { productId } = req.params;
  try {
    const foundProduct = await Product.findByPk(productId);
    foundProduct
      ? res.json(foundProduct)
      : res
          .status(404)
          .json({ message: "No such product found to be displayed!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.productCreate = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.productDelete = async (req, res) => {
  const { productId } = req.params;

  try {
    const foundProduct = await Product.findByPk(productId);
    foundProduct
      ? (await foundProduct.destroy(), res.status(204).end())
      : res
          .status(404)
          .json({ message: "No such product found to be deleted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.productUpdate = async (req, res) => {
  const { productId } = req.params;

  try {
    const foundProduct = await Product.findByPk(productId);
    foundProduct
      ? (await foundProduct.update(req.body), res.status(204).end())
      : res
          .status(404)
          .json({ message: "No such product found to be updated!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
