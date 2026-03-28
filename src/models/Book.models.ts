import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";
import Category from "./Category.models";

class Book extends Model {
  public id!: number;
  public title!: string;
  public author!: string;
  public description!: string;
  public price!: number;
  public stock!: number;
  public image!: string;
  public categoryId!: number;
}

Book.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Category,
                key: 'id'
            }
        }
    },
    {
        sequelize,
        tableName: 'books'
    }
);

export default Book;
