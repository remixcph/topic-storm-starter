import React from "react";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import type { Topic } from "@prisma/client";
import { getTopicListItems } from "~/models/topic.server";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get('query') || undefined;
  const topics = await getTopicListItems({ query });
  return json({ topics });
}

export default function TopicIndexPage() {
  const { topics } = useLoaderData<{ topics: Topic[] }>();
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
          {topics.map((topic) => (
            // Todo refactor to Topic card component
            <div key={topic.id} className="border-b">
              <Link className={`} block p-4 text-xl`} to={topic.id}>
                {topic.title}
              </Link>
              <p>{topic.description}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
