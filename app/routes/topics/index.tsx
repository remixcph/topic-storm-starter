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

  // TODO 2: get search params from request

  // TODO 1: use getTopicListItems to fetch topics form DB
  const topics = [];
  return typedjson({ topics, userId });
}

export default function TopicIndexPage() {
  const { topics, userId } = useTypedLoaderData<typeof loader>();

  // TODO: add search input handler using useCallback and useSearchParams

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-md">
        {/* TODO: Add TopicForm component */}
      </div>

      {/* TODO: add search inputfield */}

      <hr />

      {topics.length === 0 ? (
        <p className="p-4">No topics yet</p>
      ) : (
        <>{/* TODO: list topics using TopicCard */}</>
      )}
    </div>
  );
}
