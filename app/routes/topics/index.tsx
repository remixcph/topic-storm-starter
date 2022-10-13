import React from "react";
import { useSearchParams } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { getTopicListItems } from "~/models/topic.server";
import { TopicCard } from "~/components";
import { requireUserId } from "~/session.server";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { TopicForm } from "~/components/TopicForm";
import { TopicSorter } from "~/components/TopicSort";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const url = new URL(request.url);
  const query = url.searchParams.get("query") || undefined;
  const sortBy = url.searchParams.get("sort-topics") || undefined;

  const topics = await getTopicListItems({ query, sortBy });
  return typedjson({ topics, userId });
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
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-md">
        {/* TODO: Add TopicForm component */}
      </div>

      <input
        className="w-full flex-1 rounded-lg border-2 border-slate-300 px-3 text-lg leading-loose"
        placeholder="Search for a topic"
        onKeyUp={(e) => handleSearch(e)}
      />

      <div>
        <TopicSorter />
      </div>

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
  );
}
