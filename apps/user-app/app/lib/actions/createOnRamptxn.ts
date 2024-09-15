"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function createOnRamptxn(amount: number, provider: string) {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) {
    return {
      message: "User not found",
    };
  }

  const user = await prisma.onRampTransaction.create({
    data: {
      userId: Number(userId),
      amount,
      provider,
      startTime: new Date(),
      status: "Processing",
      token: `token__${Math.random()}`,
    },
  });

  return {
    message: "On Ramp Transaction Created",
  };
}
