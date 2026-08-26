import { prisma } from "../../config/prisma";
import { CretaeCategroyInput } from "./category.interface";

const createCategory = async (payload: CretaeCategroyInput) => {
  const category = await prisma.category.create({
    data: {
      ...payload,
    },
  });

  return category;
};

export const CategoryService = {
  createCategory,
};
