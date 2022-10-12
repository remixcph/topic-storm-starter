import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData, useCatch, useTransition } from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import invariant from "tiny-invariant";

import { deleteTopic, getTopic } from "~/models/topic.server";
import { requireUserId } from "~/session.server";
import { Comment } from "~/components/Comment";
import { CommentForm } from "~/components/CommentForm";
import { createComment } from "~/models/comment.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.topicId, "topicId not found");

  const topic = await getTopic({ id: params.topicId });
  if (!topic) {
    throw new Response("Not Found", { status: 404 });
  }

  return typedjson({ topic, isAuthor: topic.userId === userId });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.topicId, "topicId not found");

  const formData = await request.formData();
  const method = formData.get("_method");
  if (method === "delete") {
    const topicAuthorId = await requireUserId(request);
    if (userId === topicAuthorId)
      await deleteTopic({ userId, id: params.topicId });
    else return new Response("Forbidden", { status: 403 });
  }
  if (method === "create_comment") {
    const comment = formData.get("comment");
    if (typeof comment === "string" && comment.length > 0) {
      await createComment({ userId, topicId: params.topicId, text: comment });
    } else {
      return typedjson(
        { errors: { comment: "cannot create empty comment" } },
        { status: 400 }
      );
    }
  }

  return redirect(`/topics/${params.topicId}`);
}

export default function TopicDetailsPage() {
  const { topic, isAuthor } = useTypedLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const transition = useTransition();
  const isAdding =
    transition.state === "submitting" &&
    transition.submission.formData.get("_method") === "create_comment";

  return (
    <div>
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
        {isAuthor ? (
          <Form method="post">
            <button
              type="submit"
              className="mt-4 rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
            >
              Delete
            </button>
          </Form>
        ) : null}
      </div>
      <hr className="my-4" />
      <div>
        {topic.comments.length === 0 ? <p>No comments yet</p> : null}
        {topic.comments.map((comment) => (
          <Comment
            key={comment.id}
            author={comment.user.email}
            content={comment.text}
          />
        ))}
      </div>
      <hr className="my-4" />
      <CommentForm error={actionData?.errors.comment} isAdding={isAdding} />
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
