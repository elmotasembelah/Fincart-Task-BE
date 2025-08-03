import { UserDocument } from "../user.model";

export function normalizeUser(user: UserDocument) {
  const obj = user.toObject();

  return {
    id: obj._id.toString(),
    fullName: obj.fullName,
    email: obj.email,
    role: obj.role,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
}
