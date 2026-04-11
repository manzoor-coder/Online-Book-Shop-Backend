import Book from "./Book.models";
import Category from "./Category.models";
import Cart from "./Cart.models";
import CartItem from "./CartItem.models";
import Order from "./order.models";
import OrderItem from "./OrderItem.models";

Category.hasMany(Book, { foreignKey: 'categoryId' });
Book.belongsTo(Category, { foreignKey: 'categoryId' });

// Define associations for Cart and CartItem
Cart.hasMany(CartItem, { foreignKey: 'cartId' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

CartItem.belongsTo(Book, { foreignKey: 'bookId' });

// Define associations for Order and OrderItem

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

export { Book, Category, Cart, CartItem, Order, OrderItem };