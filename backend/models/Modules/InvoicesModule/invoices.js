// models/InvoicesModule/invoices.js
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../database");

const Invoice = sequelize.define(
  "Invoice",
  {
    invoice_id: {
      type: DataTypes.TEXT,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    customer_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sales_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    payment_type: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_timestamp: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("NOW()"),
    },
  },
  {
    tableName: "invoices",
    timestamps: false,
  }
);

module.exports = Invoice;
