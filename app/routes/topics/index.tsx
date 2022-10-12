import React from "react";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import type { Topic, User } from "@prisma/client";
import { getTopicListItems } from "~/models/topic.server";
import { TopicCard } from "~/components";
import { requireUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get('query') || undefined;
  const topics = await getTopicListItems({ query });
  const userId = await requireUserId(request);
  return json({ topics, userId });
}

export default function TopicIndexPage() {
  const { topics, userId } = useLoaderData<{ topics: Topic[], userId: User["id"] }>();
  const [ , setSearchParams] = useSearchParams();

  const handleSearch = React.useCallback((e: React.KeyboardEvent) => {
    const target = e.target as HTMLInputElement;

    if (target.value === '') {
      setSearchParams({})
    } else {
      setSearchParams({ query: target.value })}
    }, [setSearchParams])


  return (
    <div className="h-full border-r bg-gray-50">
      {/* // TODO: add new topic form */}
      <input 
        className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose w-full" 
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
              userId
            };

            return (
            <div key={topic.id}>
              <TopicCard {...topicData}/>
            </div>
          )})}
        </>
      )}
    </div>
  );
}
