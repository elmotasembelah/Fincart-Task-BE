import config from "config";
import { z } from "zod";

const MAX_PAGE_SIZE = config.get<number>("pagination.maxPageSize") || 100;

export const pageDto = z.preprocess((val) => {
  const num = parseInt(val as string);
  return isNaN(num) ? 1 : num;
}, z.number().min(1));

export const pageSizeDto = z.preprocess((val) => {
  const num = parseInt(val as string);
  return isNaN(num) ? 10 : num;
}, z.number().min(1).max(MAX_PAGE_SIZE));
