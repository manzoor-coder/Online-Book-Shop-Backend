import Book from "./Book.models";
import Category from "./Category.models";
import Cart from "./Cart.models";
import CartItem from "./CartItem.models";

Category.hasMany(Book, { foreignKey: 'categoryId' });
Book.belongsTo(Category, { foreignKey: 'categoryId' });

Cart.hasMany(CartItem, { foreignKey: 'cartId' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

CartItem.belongsTo(Book, { foreignKey: 'bookId' });

export { Book, Category, Cart, CartItem };