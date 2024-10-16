const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../database");

const Customer = sequelize.define(
  "Customer",
  {
    customer_id: {
      type: DataTypes.TEXT,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Untuk auto-generate UUID
      allowNull: false,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    gender: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    tableName: "customers",
    timestamps: false, // Nama tabel di database
  }
);

module.exports = Customer;
