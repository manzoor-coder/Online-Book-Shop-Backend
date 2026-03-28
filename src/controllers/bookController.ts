import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { createBook, getBooks, getBookById } from '../services/bookService';
import { uploadOnCloudinary } from '../utils/cloudinary';

export const addBook = asyncHandler(async (req: any, res: Response) => {
  let imageUrl = '';

  if (req.file) {
    const file = req.file?.path;

    const result = await uploadOnCloudinary(file);

    if(!result) {
      return res.status(500).json({ message: 'Image upload failed' });
    }
    
    imageUrl = result.secure_url;
  }

  const book = await createBook({
    ...req.body,
    image: imageUrl,
  });

  res.status(201).json(book);
});

export const fetchBooks = asyncHandler(async (req: Request, res: Response) => {
  const books = await getBooks(req.query);
  res.json(books);
});

export const fetchBookById = asyncHandler(
  async (req: Request, res: Response) => {
    const book = await getBookById(Number(req.params.id));
    res.json(book);
  }
);