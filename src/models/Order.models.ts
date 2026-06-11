import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Order extends Model {
  public id!: number;
  public userId!: number;
  public totalAmount!: number;
  public status!: string;
}

Order.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    totalAmount: { type: DataTypes.FLOAT, allowNull: false },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending", // pending, shipped, delivered
    },
    paymentStatus: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },

    stripeSessionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    paymentIntentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Order",
  },
);

export default Order;
