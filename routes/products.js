const express = require("express");
const {
  // productCreate,
  productList,
  productDetail,
  productDelete,
  productUpdate,
  fetchProduct,
} = require("../controllers/productController");
const router = express.Router();

const upload = require("../middleware/multer");

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

// router.post("/", upload.single("image"), productCreate);

//list
router.get("/", productList);

//detail
router.get("/:productId", productDetail);

//delete
router.delete("/:productId", productDelete);

//update
router.put("/:productId", upload.single("image"), productUpdate);

module.exports = router;
