const express = require("express");
const {
  productCreate,
  productList,
  productDetail,
  productDelete,
  productUpdate,
} = require("../controllers/productController");
const router = express.Router();

//list
router.get("/", productList);

//detail
router.get("/:productId", productDetail);

//create
router.post("/", productCreate);

//delete
router.delete("/:productId", productDelete);

//update
router.put("/:productId", productUpdate);

module.exports = router;
