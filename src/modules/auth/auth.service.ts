import { ApiError } from "../../common/errors/api-error";
import UserModel, { UserDocument } from "../user/user.model";
import bcrypt from "bcryptjs";
import config from "config";
import { LoginUserDto } from "./dto/login.dto";
import { signJWT } from "../../common/security/jwt";
import { normalizeUser } from "../user/helpers/normalize-user.helper";
export const loginUser = async ({ email, password }: LoginUserDto) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new ApiError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError("Invalid email or password", 401);
  }

  const { accessToken, refreshToken } = generateTokens(user);

  const normalizedUser = normalizeUser(user);

  return {
    accessToken,
    refreshToken,
    user: normalizedUser,
  };
};

export const generateTokens = (user: UserDocument) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = signJWT(payload, {
    expiresIn: config.get("jwt.accessTokenTtl"),
  });

  const refreshToken = signJWT(payload, {
    expiresIn: config.get("jwt.refreshTokenTtl"),
  });

  return { accessToken, refreshToken };
};
