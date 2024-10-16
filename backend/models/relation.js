const Invoice = require("../models/Modules/InvoicesModule/invoices");
const Customer = require("../models/Modules/CustomerModule/customers"); // Import Customer model
const SalesPerson = require("../models/Modules/SalesPersonModule/salesPerson"); // Import SalesPerson model
const Product = require("../models/Modules/ProductsModule/products"); // Import Product model
const ProductsSold = require("../models/Modules/ProductsSoldModule/ProductsSold"); // Import ProductsSold model

// Relationships between Customer and Invoice
Customer.hasMany(Invoice, {
  foreignKey: "customer_id", // Use customer_id for foreign key
});

// Relationships between SalesPerson and Invoice
SalesPerson.hasMany(Invoice, {
  foreignKey: "sales_id", // Use sales_id for foreign key
});

// Setup relationships
Invoice.hasMany(ProductsSold, {
  foreignKey: "invoice_id", // Foreign key in ProductsSold
});
ProductsSold.belongsTo(Invoice, {
  foreignKey: "invoice_id", // Foreign key in ProductsSold
});

Product.hasMany(ProductsSold, {
  foreignKey: "product_id", // Associate products sold with products
});
ProductsSold.belongsTo(Product, {
  foreignKey: "product_id", // Foreign key in ProductsSold
});

module.exports = {
  Invoice,
  Customer,
  SalesPerson,
  Product,
  ProductsSold,
};
