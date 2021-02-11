const express = require("express");
const {
  productCreate,
  productList,
  productDetail,
  productDelete,
  productUpdate,
  fetchProduct,
} = require("../controllers/productController");
const router = express.Router();

router.param("productId", async (req, res, next, productId) => {
  const foundProduct = await fetchProduct(productId, next);
  if (foundProduct) {
    req.product = foundProduct;
    next();
  } else {
    next({
      status: 404,
      message: "Product not found",
    });
  }
});

//list
router.get("/", productList);

//create
router.post("/", productCreate);
//detail
router.get("/:productId", productDetail);

//delete
router.delete("/:productId", productDelete);

//update
router.put("/:productId", productUpdate);

module.exports = router;
