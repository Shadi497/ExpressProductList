const express = require("express");
const App = express();
const db = require("./db/models");
const productRoutes = require("./routes/products");
const shopRoutes = require("./routes/shops");
const userRoutes = require("./routes/users");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const { localStrategy } = require("./middleware/passport");

//middleware
App.use(express.json());
App.use(cors());

//passport
App.use(passport.initialize());
passport.use(localStrategy);

//routes
App.use("/products", productRoutes);
App.use("/shops", shopRoutes);
App.use(userRoutes);
App.use("/media", express.static(path.join(__dirname, "media")));

//Not Found
App.use((req, res, next) => {
  next({
    status: 404,
    message: "Path not found",
  });
});

//Error Handling
App.use((error, req, res, next) => {
  res
    .status(error.status || 500)
    .json({ message: error.message || "Internal Server Error" });
});

db.sequelize.sync({ alter: true });
// db.sequelize.sync({ force: true });

App.listen(8000, () => {
  console.log("Application is running");
});
