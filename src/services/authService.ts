import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.models";
import ApiError from "../utils/apiError";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { ApiResponse } from "../utils/apiResponse";

interface RegisterUserInput {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  email: string;
  password: string;
  profileImage?: string; // local file path (from multer)
}

interface LoginResponse {
  user: any;
  token: string;
}

const generateToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};

export const registerUser = async (data: RegisterUserInput) => {
  const { firstName, lastName, phone, address, email, password, profileImage } =
    data;

  // ✅ Validate
  if (!firstName || !lastName || !phone || !address || !email || !password) {
    throw new ApiError(400, "Please fill all required fields.");
  }

  // ✅ Check existing user
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  // ✅ Upload image (if exists)
  let uploadedImageUrl: string | undefined = undefined;

  if (profileImage) {
    const uploadResult = await uploadOnCloudinary(profileImage);

    console.log(uploadResult); 

    if (!uploadResult) {
      throw new ApiError(500, "Image upload failed");
    }

    uploadedImageUrl = uploadResult.secure_url;
  }

  // ✅ Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // ✅ Create user (only required fields)
  const user = await User.create({
    firstName,
    lastName,
    phone,
    address,
    email,
    password: hashedPassword,
    profileImage: uploadedImageUrl,
  });

  const userData = user.toJSON();
  const { password: _password, ...safeUser } = userData;

  // ✅ Return ApiResponse
  return new ApiResponse(
    200, 
    {
      user: safeUser
    }, 
    "User registered successfully"
  );
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<ApiResponse<LoginResponse>> => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(400, "Invalid credentials");
  }

  const token = generateToken(user.id);

  // ✅ Optional: remove password before sending
  const userData = user.toJSON();
  const { password: _password, ...safeUser } = userData;

  // ✅ Correct ApiResponse usage
  return new ApiResponse(
    200,
    {
      user: safeUser,
      token,
    },
    "User login successfully",
  );
};

export const generateResetToken = async (
  email: string,
): Promise<ApiResponse<{ resetToken: string }>> => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // ✅ generate raw token (send to user)
  const resetToken = crypto.randomBytes(32).toString("hex");

  // ✅ hash token (store in DB)
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetToken = hashedToken;
  user.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  await user.save();

  return new ApiResponse(
    200,
    { resetToken }, // 👉 send raw token (email later)
    "Reset token generated",
  );
};

export const resetPassword = async (
  token: string,
  newPassword: string,
): Promise<ApiResponse<null>> => {
  // ✅ hash incoming token
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    where: { resetToken: hashedToken },
  });

  if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    throw new ApiError(400, "Invalid or expired token");
  }

  // ✅ update password
  user.password = await bcrypt.hash(newPassword, 10);

  // ✅ clear reset fields (IMPORTANT: use undefined, not null)
  user.resetToken = undefined as any;
  user.resetTokenExpiry = undefined as any;

  await user.save();

  return new ApiResponse(200, null, "Password reset successfully");
};
