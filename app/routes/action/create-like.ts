import type { Topic } from "@prisma/client";
import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { createLike } from "~/models/like.server";
import { requireUserId } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const topicId = formData.get("topic_id") as Topic["id"];

  await createLike({ id: topicId, userId });

  return redirect(request.headers.get("referer") || "/topics");
};
