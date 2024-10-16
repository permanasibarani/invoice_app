const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../database");

const Product = sequelize.define(
  "Product",
  {
    product_id: {
      type: DataTypes.TEXT,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    product_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    product_picture_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    created_timestamp: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("NOW()"),
    },
    deleted_timestamp: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_timestamp: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "products",
    timestamps: false,
  }
);

module.exports = Product;
