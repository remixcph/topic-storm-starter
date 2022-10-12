import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { TopicForm } from "~/components/TopicForm";

import { createTopic } from "~/models/topic.server";
import { requireUserId } from "~/session.server";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  const redirect_to = formData.get("redirect_to") as string;

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { title: "Title is required", description: null } },
      { status: 400 }
    );
  }

  if (typeof description !== "string" || description.length === 0) {
    return json(
      { errors: { title: null, description: "description is required" } },
      { status: 400 }
    );
  }

  const topic = await createTopic({ title, description, userId });

  return redirect(redirect_to || `/topics/${topic.id}`);
}

export default function NewTopicPage() {
  return <TopicForm />;
}
