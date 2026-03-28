import Book from "./Book.models";
import Category from "./Category.models";

Category.hasMany(Book, { foreignKey: 'categoryId' });
Book.belongsTo(Category, { foreignKey: 'categoryId' });

export { Book, Category };