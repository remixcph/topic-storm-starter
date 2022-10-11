import type { Topic } from "@prisma/client";
import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getTopicListItems } from "~/models/topic.server";
import { requireUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const topics = await getTopicListItems({ userId });
  return json({ topics });
}

export default function TopicIndexPage() {
  const { topics } = useLoaderData<{ topics: Topic[] }>();
  console.log(topics);

  return (
    <div className="h-full border-r bg-gray-50">
      {/* // TODO: add new topic form */}
      {/* // TODO: add topic search */}
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
