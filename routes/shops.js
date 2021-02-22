const express = require("express");
const passport = require("passport");
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
router.post(
  "/new",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  shopCreate
);

//create product
router.post(
  "/:shopId/products",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  productCreate
);

//detail
router.get("/:shopId", shopDetail);

//delete
router.delete("/:shopId", shopDelete);

//update
router.put("/:shopId", upload.single("image"), shopUpdate);

module.exports = router;
