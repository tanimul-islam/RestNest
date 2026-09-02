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
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found", {
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
  const { location, minPrice, maxPrice, type } = filters || {};

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

    select: {
      id: true,
      title: true,
      city: true,
      price: true,
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

const getPropertyById = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: {
      id,
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
  });

  if (!property) {
    throw new ApiError(httpStatus.NOT_FOUND, "Property not found", {
      propertyId: id,
    });
  }

  return property;
};

const updateProperty = async (
  propertyId: string,
  landlordId: string,
  payload: Partial<CreatePropertyInput>,
) => {
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!property) {
    throw new ApiError(httpStatus.NOT_FOUND, "Property not found", {
      propertyId,
    });
  }

  if (property.landlordId !== landlordId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to update this property",
    );
  }

  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: payload.categoryId,
      },
    });

    if (!category) {
      throw new ApiError(httpStatus.NOT_FOUND, "Category not found", {
        field: "categoryId",
      });
    }
  }

  const updatedProperty = await prisma.property.update({
    where: {
      id: propertyId,
    },
    data: payload,
  });

  return updatedProperty;
};

const deleteProperty = async (propertyId: string, landlordId: string) => {
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!property) {
    throw new ApiError(httpStatus.NOT_FOUND, "Property not found", {
      propertyId,
    });
  }

  if (property.landlordId !== landlordId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to update this property",
    );
  }

  await prisma.property.delete({
    where: {
      id: propertyId,
    },
  });

  return null;
};

export const PropertyService = {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};
