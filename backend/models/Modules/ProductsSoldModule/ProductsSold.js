// models/ProductsSoldModule/ProductsSold.js
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../database");

const ProductsSold = sequelize.define(
  "ProductsSold",
  {
    products_sold_id: {
      type: DataTypes.TEXT,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    invoice_id: {
      type: DataTypes.TEXT,
      allowNull: false,
      references: {
        model: "invoices", // Ensure this matches the invoice model
        key: "invoice_id",
      },
    },
    product_id: {
      type: DataTypes.TEXT,
      allowNull: false,
      references: {
        model: "products",
        key: "product_id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    created_timestamp: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("NOW()"),
    },
  },
  {
    tableName: "products_sold",
    timestamps: false,
  }
);

module.exports = ProductsSold;
