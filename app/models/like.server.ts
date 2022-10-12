import type { Topic, Like } from "@prisma/client";

import { prisma } from "~/db.server";

export function createLike({ id, userId }: Pick<Topic, "id" | "userId">) {
  return prisma.like.create({
    data: {
      topic: {
        connect: {
          id,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteLike({ id }: Pick<Like, "id">) {
  return prisma.like.delete({
    where: { id },
  });
}
