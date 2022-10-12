import React from "react";
import { useSearchParams } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { getTopicListItems } from "~/models/topic.server";
import { TopicCard } from "~/components";
import { requireUserId } from "~/session.server";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const url = new URL(request.url);
  const query = url.searchParams.get("query") || undefined;
  const topics = await getTopicListItems({ query });
  return typedjson({ topics, userId });
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
  const { topics, userId } = useTypedLoaderData<typeof loader>();
  const [, setSearchParams] = useSearchParams();

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
    <>
      <input
        className="mb-4 w-full flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
        placeholder="Search for a topic"
        onKeyUp={(e) => handleSearch(e)}
      />

      <div className="h-full flex-row rounded border-r bg-gray-50">
        {/* // TODO: add new topic form */}
        <hr />

        {topics.length === 0 ? (
          <p className="p-4">No topics yet</p>
        ) : (
          <>
            {topics.map((topic) => {
              return <TopicCard key={topic.id} topic={topic} userId={userId} />;
            })}
          </>
        )}
      </div>
    </>
  );
}
