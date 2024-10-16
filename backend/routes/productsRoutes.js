// backend/routes/productRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productsController");

// Route untuk mendapatkan semua produk
router.get("/getProducts", productController.getAllProducts);

module.exports = router;
