const express = require("express");
const App = express();
const db = require("./db/models");
const productRoutes = require("./routes/products");

App.use(express.json());
App.use("/products", productRoutes);

db.sequelize.sync({ alter: true });
// db.sequelize.sync({ force: true });

App.listen(8000, () => {
  console.log("Application is running");
});
