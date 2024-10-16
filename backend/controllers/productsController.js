// backend/controllers/productController.js
const Product = require("../models/Modules/ProductsModule/products"); // Import model Product

// Fungsi untuk mendapatkan semua produk
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll(); // Mengambil semua produk dari database
    res.status(200).json(products); // Mengembalikan data produk sebagai respon
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
