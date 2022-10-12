import type { Topic, User, Comment } from "@prisma/client";

import { prisma } from "~/db.server";

export function createComment({
  text,
  topicId,
  userId,
}: Pick<Comment, "text"> & {
  topicId: Topic["id"];
  userId: User["id"];
}) {
  return prisma.comment.create({
    data: {
      text,
      topic: {
        connect: {
          id: topicId,
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
