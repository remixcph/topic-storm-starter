import type { Assignee } from "@prisma/client";
import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { deleteAsssignee } from "~/models/assignee.server";
import { requireUser } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  await requireUser(request);
  const formData = await request.formData();
  const assigneeId = formData.get("assignee_id") as Assignee["id"];

  await deleteAsssignee({ id: assigneeId });

  return redirect(request.headers.get("referer") || "/topics");
};
