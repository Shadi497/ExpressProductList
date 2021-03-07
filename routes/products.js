const express = require("express");
const passport = require("passport");
const {
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

//list
router.get("/", productList);

//detail
router.get("/:productId", productDetail);

//delete
router.delete(
  "/:productId",
  passport.authenticate("jwt", { session: false }),
  productDelete
);

//update
router.put(
  "/:productId",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  productUpdate
);

module.exports = router;
