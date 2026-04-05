import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import {
  registerUser,
  loginUser,
  generateResetToken,
  resetPassword,
  getCurrentUser,
  deleteUser,
} from '../services/authService';
import { updateUserProfile } from '../services/authService';
import { AuthRequest } from '../types/express';

export const register = asyncHandler(async (req: Request, res: Response) => {

   console.log("BODY:", req.body);
  console.log("FILE:", req.file);
  const response = await registerUser({
    ...req.body,
    profileImage: req.file?.buffer, // if using multer
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

// Get Current User
export const getProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const response = await getCurrentUser(req.user!.id);

    res.status(response.statusCode).json(response);
  }
);

export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const response = await updateUserProfile(req.user!.id, {
      ...req.body,
      profileImage: req.file?.buffer, // multer
    });

    res.status(response.statusCode).json(response);
  }
);

// Delete User
export const deleteAccount = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const response = await deleteUser(req.user!.id);

    res.status(response.statusCode).json(response);
  }
);