import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "cph@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("remixcopenhagenmeetup", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const topic = await prisma.topic.create({
    data: {
      title: "My first topic",
      description: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.topic.create({
    data: {
      title: "My second topic",
      description: "Hello, CPH!",
      userId: user.id,
    },
  });

  await prisma.comment.create({
    data: {
      text: "My first comment",
      userId: user.id,
      topicId: topic.id,
    },
  });

  await prisma.comment.create({
    data: {
      text: "My second comment",
      userId: user.id,
      topicId: topic.id,
    },
  });

  await prisma.like.create({
    data: {
      userId: user.id,
      topicId: topic.id,
    },
  });

  await prisma.assignee.create({
    data: {
      userId: user.id,
      topicId: topic.id,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
