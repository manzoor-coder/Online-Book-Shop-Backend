import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Order extends Model {
  public id!: number;
  public userId!: number;
  public totalAmount!: number;
  public status!: string;
}

Order.init( {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  totalAmount: { type: DataTypes.FLOAT, allowNull: false },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending', // pending, shipped, delivered
  },
}, {
  sequelize,
  modelName: 'Order',
}
);

export default Order;