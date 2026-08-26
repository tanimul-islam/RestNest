import { gte } from "zod";
import { prisma } from "../../config/prisma";
import ApiError from "../../utils/apiError";
import { CreatePropertyInput, PropertyFilters } from "./property.interface";
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

const getProperties = async (filters: PropertyFilters) => {
  const { location, minPrice, maxPrice, type } = filters;

  const properties = await prisma.property.findMany({
    where: {
      ...(location && {
        OR: [
          {
            city: {
              contains: location,
              mode: "insensitive",
            },
          },
          {
            address: {
              contains: location,
              mode: "insensitive",
            },
          },
        ],
      }),
      ...((minPrice || maxPrice) && {
        price: {
          ...(minPrice && {
            gte: Number(minPrice),
          }),

          ...(maxPrice && {
            lte: Number(maxPrice),
          }),
        },
      }),

      ...(type && {
        category: {
          name: {
            contains: type,
            mode: "insensitive",
          },
        },
      }),
    },

    include: {
      category: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
      landlord: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return properties;
};

export const PropertyService = {
  createProperty,
  getProperties,
};
