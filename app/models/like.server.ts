import type { Topic, User } from '@prisma/client';

import { prisma } from "~/db.server";


export function createLike({
    id,
    userId
}: Pick<Topic, "id"> & {
  userId: User["id"];
}) {
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
        }
    })
}