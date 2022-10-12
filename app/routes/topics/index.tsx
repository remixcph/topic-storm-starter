import React from "react";
import {
  useActionData,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import type { Topic, User } from "@prisma/client";
import { createTopic, getTopicListItems } from "~/models/topic.server";
import { TopicCard } from "~/components";
import { requireUserId } from "~/session.server";
import { TopicForm } from "~/components/TopicForm";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query") || undefined;
  const topics = await getTopicListItems({ query });
  const userId = await requireUserId(request);
  return json({ topics, userId });
}

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");

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

  await createTopic({ title, description, userId });

  return redirect(`/topics`);
}

export default function TopicIndexPage() {
  const { topics, userId } = useLoaderData<{
    topics: Topic[];
    userId: User["id"];
  }>();
  const [, setSearchParams] = useSearchParams();
  const actionData = useActionData<typeof action>();

  const handleSearch = React.useCallback(
    (e: React.KeyboardEvent) => {
      const target = e.target as HTMLInputElement;

      if (target.value === "") {
        setSearchParams({});
      } else {
        setSearchParams({ query: target.value });
      }
    },
    [setSearchParams]
  );

  return (
    <div className="h-full border-r bg-gray-50">
      <TopicForm errors={actionData?.errors} />
      <div className="m-4" />

      <input
        className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
        placeholder="Search for a topic"
        onKeyUp={(e) => handleSearch(e)}
      />
      <hr />

      {topics.length === 0 ? (
        <p className="p-4">No topics yet</p>
      ) : (
        <>
          {topics.map((topic) => {
            const topicData = {
              ...topic,
              userId,
            };

            return (
              <div key={topic.id}>
                <TopicCard {...topicData} />
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
