const express = require("express");
const App = express();
const db = require("./db/models");
const productRoutes = require("./routes/products");
const cors = require("cors");

App.use(express.json());
App.use(cors());
App.use("/products", productRoutes);

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

// db.sequelize.sync({ alter: true });
db.sequelize.sync({ force: true });

App.listen(8000, () => {
  console.log("Application is running");
});
