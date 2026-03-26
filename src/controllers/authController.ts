import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import {
  registerUser,
  loginUser,
  generateResetToken,
  resetPassword,
} from '../services/authService';

export const register = asyncHandler(async (req: Request, res: Response) => {

  const response = await registerUser({
    ...req.body,
    profileImage: req.file?.path, // if using multer
  });

  res.status(response.statusCode).json(response);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const response = await loginUser(email, password);

  res.status(response.statusCode).json(response);
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const response = await generateResetToken(email);

  // 👉 later you will send email instead of returning token
  res.status(response.statusCode).json(response);
});

export const resetPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, password } = req.body;

    const response = await resetPassword(token, password);

    res.status(response.statusCode).json(response);
  }
);