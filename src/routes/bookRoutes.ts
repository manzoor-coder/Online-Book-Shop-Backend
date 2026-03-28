import express from 'express';
import { addBook, fetchBooks, fetchBookById } from '../controllers/bookController';
import { protect } from '../middlewares/authMiddleware';
import { isAdmin } from '../middlewares/adminMiddleware';
import upload from '../middlewares/uploadMiddleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Books
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 */
router.get('/', fetchBooks);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get book by ID
 *     tags: [Books]
 */
router.get('/:id', fetchBookById);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Add new book (Admin)
 *     tags: [Books]
 */
router.post('/', protect, isAdmin, upload.single('image'), addBook);

export default router;