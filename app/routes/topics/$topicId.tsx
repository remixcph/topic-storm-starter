import type { Assignee } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useCatch,
  useFetcher,
  useTransition,
} from "@remix-run/react";
import clsx from "clsx";
import { useCallback, useMemo } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import invariant from "tiny-invariant";

import { Comment } from "~/components/Comment";
import { CommentForm } from "~/components/CommentForm";
import { createComment } from "~/models/comment.server";
import type { Topic } from "~/models/topic.server";
import { deleteTopic, getTopic } from "~/models/topic.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.topicId, "topicId not found");

  const topic = await getTopic({ id: params.topicId });
  if (!topic) {
    throw new Response("Not Found", { status: 404 });
  }

  return typedjson({ topic, isAuthor: topic.userId === userId, userId });
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

  return redirect(`/topics`);
}

export default function TopicDetailsPage() {
  const { topic, isAuthor, userId } = useTypedLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const actionData = useActionData<typeof action>();
  const transition = useTransition();

  const isAdding =
    transition.state === "submitting" &&
    transition.submission.formData.get("_method") === "create_comment";

  const assignee = useMemo(
    () => topic.assignees.find((assignee) => assignee.userId === userId),
    [topic.assignees, userId]
  );

  const handleCreateAssignee = useCallback(
    (id: Topic["id"]) => {
      fetcher.submit(
        { topic_id: id },
        { action: "action/create-assignee", method: "post" }
      );
    },
    [fetcher]
  );

  const handleDeleteAssignee = useCallback(
    (id: Assignee["id"]) => {
      fetcher.submit(
        { assignee_id: id },
        { action: "action/delete-assignee", method: "post" }
      );
    },
    [fetcher]
  );

  return (
    <div className="flex flex-col rounded-lg border border-slate-200 p-4 shadow-md">
      <h3 className="text-2xl font-bold">{topic.title}</h3>
      <p className="py-6">{topic.description}</p>

      <p>Likes: {topic.likes.length}</p>

      <p>
        Assignes:{" "}
        {topic.assignees.length === 0 ? (
          <span>No assignees yet</span>
        ) : (
          topic.assignees.map((assignee) => assignee.user.email).join(", ")
        )}
      </p>

      <hr className="my-4" />

      <div className="flex gap-4">
        <button
          name="assign"
          type="button"
          className={clsx("rounded py-2 px-4 text-white ", {
            "bg-purple-500 hover:bg-purple-600": assignee !== undefined,
            "bg-green-500 hover:bg-green-600": assignee === undefined,
          })}
          onClick={() =>
            assignee
              ? handleDeleteAssignee(assignee.id)
              : handleCreateAssignee(topic.id)
          }
        >
          {assignee ? "Unassign" : "Assign myself"}
        </button>

        <Form method="post">
          {isAuthor && (
            <button
              name="delete"
              type="submit"
              className="mt-4 rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600"
            >
              <input name="_method" type="hidden" value="delete" />
              Delete
            </button>
          )}
        </Form>
      </div>

      <hr className="my-4" />

      <div className="flex flex-col gap-4">
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
