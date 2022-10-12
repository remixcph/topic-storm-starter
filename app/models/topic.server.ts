import type { User, Topic, Assignee, Like } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Topic } from "@prisma/client";

export type ExtendedTopic = Topic & {
  assignees: (Assignee & { user: User })[];
  comments: (Comment & { user: User })[];
  likes: Like[];
};

export function getUsers({ userIDs }: { userIDs: string[] }) {
  return prisma.user.findMany({
    where: {
      id: {
        in: userIDs,
      },
    },
  });
}

export function getTopic({ id }: Pick<Topic, "id">) {
  return prisma.topic.findFirst({
    include: {
      likes: true,
      assignees: {
        include: {
          user: true,
        },
      },
      comments: {
        include: {
          user: true,
        },
      },
    },
    where: { id },
  });
}

export function getTopicListItems({ query = "" }: { query?: string }) {
  return prisma.topic.findMany({
    where: {
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
      ],
    },
    include: {
      assignees: {
        include: {
          user: true,
        },
      },
      comments: {
        include: {
          user: true,
        },
      },
      likes: true,
    },
    // orderBy: { likes: { _count: "desc" } },
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
