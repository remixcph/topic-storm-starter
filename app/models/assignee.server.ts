import type { Assignee, Topic } from "@prisma/client";

import { prisma } from "~/db.server";

export function createAssignee({ id, userId }: Pick<Topic, "id" | "userId">) {
  return prisma.assignee.create({
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

export function deleteAsssignee({ id }: Pick<Assignee, "id">) {
  return prisma.assignee.delete({
    where: { id },
  });
}
