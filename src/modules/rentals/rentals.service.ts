import { prisma } from "../../config/prisma";
import ApiError from "../../utils/apiError";
import httpStatus from "http-status";

type TRentalRequest = {
  propertyId: string;
  totalAmount: number;
  moveInDate?: Date;
  durationMonths?: number;
  message?: string;
};

const createRequest = async (tenantId: string, payload: TRentalRequest) => {
  const property = await prisma.property.findUnique({
    where: {
      id: payload.propertyId,
    },
  });

  if (!property) {
    throw new ApiError(httpStatus.NOT_FOUND, "Property not found", {
      propertyId: payload.propertyId,
    });
  }

  const existingRequest = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId: payload.propertyId,
      status: "PENDING",
    },
  });

  if (existingRequest) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "You already have a pending rental request for this property",
      {
        requestId: existingRequest.id,
      },
    );
  }

  const result = await prisma.rentalRequest.create({
    data: {
      propertyId: payload.propertyId,
      tenantId,
      totalAmount: payload.totalAmount,
      moveInDate: payload.moveInDate,
      durationMonths: payload.durationMonths,
      message: payload.message,
    },
    include: {
      property: true,
    },
  });

  return result;
};

export const RentalService = {
  createRequest,
};
