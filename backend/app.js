const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const invoiceRoutes = require("./routes/invoiceRoutes");
const productRoutes = require("./routes/productsRoutes"); // Import product routes
require("./models/init"); //Run this on the first time
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/invoices", invoiceRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
