import { prisma } from "../../config/prisma";
import ApiError from "../../utils/apiError";
import { CreatePropertyInput } from "./property.interface";
import httpStatus from "http-status";

const createProperty = async (
  landlordId: string,
  payload: CreatePropertyInput,
) => {
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category Not FOund", {
      field: "categoryId",
    });
  }

  const property = await prisma.property.create({
    data: {
      ...payload,
      landlordId,
    },
  });

  return property;
};

export const PropertyService = {
  createProperty,
};
