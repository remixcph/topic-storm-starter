import type { Like } from "@prisma/client";
import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { deleteLike } from "~/models/like.server";
import { requireUser } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  await requireUser(request);
  const formData = await request.formData();
  const likeId = formData.get("like_id") as Like["id"];

  await deleteLike({ id: likeId });

  return redirect(request.headers.get("referer") || "/topics");
};
