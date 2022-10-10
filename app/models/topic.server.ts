import type { User, Topic } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Topic } from "@prisma/client";

export function getTopic({
  id,
  userId,
}: Pick<Topic, "id"> & {
  userId: User["id"];
}) {
  return prisma.topic.findFirst({
    select: {
      id: true,
      description: true,
      title: true,
      comments: {
        select: { id: true, text: true, user: { select: { email: true } } },
      },
      likes: { select: { id: true } },
      assignees: { select: { id: true, user: { select: { email: true } } } },
    },
    where: { id, userId },
  });
}

export function getTopicListItems({ userId }: { userId: User["id"] }) {
  return prisma.topic.findMany({
    where: { userId },
    select: { id: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createTopic({
  description,
  title,
  userId,
}: Pick<Topic, "description" | "title"> & {
  userId: User["id"];
}) {
  return prisma.topic.create({
    data: {
      title,
      description,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteTopic({
  id,
  userId,
}: Pick<Topic, "id"> & { userId: User["id"] }) {
  return prisma.topic.deleteMany({
    where: { id, userId },
  });
}
