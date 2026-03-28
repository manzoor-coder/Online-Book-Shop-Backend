import { Op } from 'sequelize';
import { Book, Category } from '../models';
import redis from '../config/redis';

export const createBook = async (data: any) => {
  const book = await Book.create(data);

  await redis.del('books'); // clear cache

  return book;
};

export const getBooks = async (query: any) => {
  const cache = await redis.get('books');

  if (cache) {
    return JSON.parse(cache);
  }

  const { search, page = 1, limit = 10 } = query;

  const where: any = {};

  if (search) {
    where.title = { [Op.like]: `%${search}%` };
  }

  const books = await Book.findAndCountAll({
    where,
    include: [{ model: Category }],
    limit: +limit,
    offset: (page - 1) * limit,
  });

  await redis.set('books', JSON.stringify(books), 'EX', 60);

  return books;
};

export const getBookById = async (id: number) => {
  return await Book.findByPk(id, {
    include: [Category],
  });
};