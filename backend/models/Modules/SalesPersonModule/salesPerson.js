const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../database");

const SalesPerson = sequelize.define(
  "SalesPerson",
  {
    employee_id: {
      type: DataTypes.TEXT,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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
    tableName: "sales_person",
    timestamps: false,
  }
);

module.exports = SalesPerson;
