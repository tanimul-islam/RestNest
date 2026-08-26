import bcrypt from "bcryptjs";

import config from "../config";
import { prisma } from "../config/prisma";

const seedAdmin = async () => {
  const email = config.admin_email as string;
  const password = config.admin_password as string;

  const existingAdmin = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingAdmin) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  await prisma.user.create({
    data: {
      name: "System Admin",
      email,
      password: hashedPassword,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  console.log("Admin created successfully");
};

seedAdmin()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
