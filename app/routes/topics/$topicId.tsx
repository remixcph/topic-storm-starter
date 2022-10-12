import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useCatch } from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import invariant from "tiny-invariant";

import { deleteTopic, getTopic } from "~/models/topic.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  await requireUserId(request);
  invariant(params.topicId, "topicId not found");

  const topic = await getTopic({ id: params.topicId });
  if (!topic) {
    throw new Response("Not Found", { status: 404 });
  }

  return typedjson({ topic });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.topicId, "topicId not found");

  await deleteTopic({ userId, id: params.topicId });

  return redirect("/topics");
}

export default function TopicDetailsPage() {
  const { topic } = useTypedLoaderData<typeof loader>();

  return (
    <div className="rounded bg-yellow-100 p-2">
      <h3 className="text-2xl font-bold">{topic.title}</h3>
      <p>Created at: {topic.createdAt.toString()}</p>
      <p>Updated at: {topic.updatedAt.toString()}</p>
      <p className="py-6">{topic.description}</p>

      <p>Likes: {topic.likes.length}</p>
      <p>
        Assignes:{" "}
        {topic.assignees.length === 0 ? (
          <p className="bg-red-400 py-6">No assignees yet</p>
        ) : (
          topic.assignees.map((assignee) => assignee.user.email).join(", ")
        )}
      </p>
      <hr className="my-4" />

      <Form method="post">
        <button
          type="submit"
          className="mt-4 rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Topic not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
