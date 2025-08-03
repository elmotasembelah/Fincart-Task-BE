import { Request, Response } from "express";
import { getMe } from "./user.service";

export const getMeController = async (req: Request, res: Response) => {
  const userId = res.locals.user.id;

  const user = await getMe(userId);

  res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    data: { user },
  });
};
