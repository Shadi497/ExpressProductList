const express = require("express");
const passport = require("passport");
const { signup, signin } = require("../controllers/userController");
const router = express.Router();

//signup
router.post("/signup", signup);

//signin
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  signin
);

module.exports = router;
