import { NextFunction, Request, Response } from "express";
import { CreateSlotDto } from "./dto/create-slot.dto";
import { createSlot, deleteSlot, getSlots, updateSlot } from "./slot.service";
import { GetSlotsQuery } from "./dto/get-slots.dto";
import { UpdateSlotBody, UpdateSlotParams } from "./dto/update-slot.dto";
import { DeleteSlotDto } from "./dto/delete-slot.dto";

export const createSlotController = async (
  req: Request<{}, {}, CreateSlotDto>,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.user.id;
  const data = req.body;

  const slot = await createSlot({ data, providerId: userId });

  return res.status(201).json({
    success: true,
    message: "Slot created successfully",
    data: slot,
  });
};

export const getSlotsController = async (
  req: Request<{}, {}, {}, GetSlotsQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, pageSize, ...filters } = req.query;

    const { data, pagination } = await getSlots({
      filters,
      page,
      pageSize,
    });

    return res.status(200).json({
      success: true,
      message: "Slots fetched successfully",
      data,
      pagination: pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSlotController = async (
  req: Request<UpdateSlotParams, {}, UpdateSlotBody>,
  res: Response,
  next: NextFunction
) => {
  const providerId = res.locals.user.id;
  const { slotId } = req.params;
  const updateData = req.body;

  const updatedSlot = await updateSlot({
    slotId,
    providerId,
    updateData,
  });

  return res.status(200).json({
    success: true,
    message: "Slot updated successfully",
    data: updatedSlot,
  });
};

export const deleteSlotController = async (
  req: Request<DeleteSlotDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slotId } = req.params;
    const userId = res.locals.user.id;

    const slot = await deleteSlot({ slotId, providerId: userId });

    return res.status(200).json({
      success: true,
      message: "Slot deleted successfully",
      data: slot,
    });
  } catch (error) {
    next(error);
  }
};
