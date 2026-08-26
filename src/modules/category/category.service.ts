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

const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return categories;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
};
