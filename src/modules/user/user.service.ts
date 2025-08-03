import bcrypt from "bcryptjs";
import UserModel from "./user.model";
import { ApiError } from "../../common/errors/api-error";
import { RegisterUserDto } from "../auth/dto/register.dto";
import { normalizeUser } from "./helpers/normalize-user.helper";
import { generateTokens } from "../auth/auth.service";

export const createUser = async (userData: RegisterUserDto) => {
  const existingUser = await UserModel.findOne({ email: userData.email });

  if (existingUser) {
    throw new ApiError("Email is already in use", 409);
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const user = await UserModel.create({
    ...userData,
    password: hashedPassword,
  });

  const { accessToken, refreshToken } = generateTokens(user);

  const normalizedUser = normalizeUser(user);

  return {
    accessToken,
    refreshToken,
    user: normalizedUser,
  };
};

export const getMe = async (id: string) => {
  const user = await UserModel.findById(id);

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  return normalizeUser(user);
};
