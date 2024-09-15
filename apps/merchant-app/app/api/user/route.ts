import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export const GET = async () => {
  const email = "asd";
  const name = "adsads";
  const number = "1234567890";
  const password = "password123";

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "User with this email already exists",
        },
        {
          status: 409,
        }
      );
    }

    // Create a new user if not exists
    await prisma.user.create({
      data: {
        email,
        name,
        number,
        password,
      },
    });

    return NextResponse.json({
      message: "User created successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred",
        error: error as unknown as string,
      },
      {
        status: 500,
      }
    );
  }
};
