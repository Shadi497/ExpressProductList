const express = require("express");
const {
  shopCreate,
  shopList,
  shopDetail,
  shopDelete,
  shopUpdate,
  fetchShop,
  productCreate,
} = require("../controllers/shopController");
const router = express.Router();

const upload = require("../middleware/multer");

router.param("shopId", async (req, res, next, shopId) => {
  const foundShop = await fetchShop(shopId, next);
  if (foundShop) {
    req.shop = foundShop;
    next();
  } else {
    next({
      status: 404,
      message: "Shop not found",
    });
  }
});

//list
router.get("/", shopList);

//create shop
router.post("/", upload.single("image"), shopCreate);

//create product
router.post("/:shopId/products", upload.single("image"), productCreate);

//detail
router.get("/:shopId", shopDetail);

//delete
router.delete("/:shopId", shopDelete);

//update
router.put("/:shopId", upload.single("image"), shopUpdate);

module.exports = router;