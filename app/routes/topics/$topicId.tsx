import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useCatch } from "@remix-run/react";
import clsx from "clsx";
import { useCallback, useMemo } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

export async function loader({ request, params }: LoaderArgs) {
  // TODO: implement loader function
  return typedjson({});
}

export async function action({ request, params }: ActionArgs) {
  // TODO: implement action function
  return redirect(`/topics`);
}

export default function TopicDetailsPage() {
  const {} = useTypedLoaderData<typeof loader>();
  const assignee = useMemo(() => {
    // TODO: check if assignee is set to current user
    return true;
  }, []);

  const isAuthor = false; // TODO - get author

  const handleCreateAssignee = useCallback(() => {
    // TODO: implement handleCreateAssignee function
  }, []);
  const handleDeleteAssignee = useCallback(() => {
    // TODO: implement handleDeleteAssignee function
  }, []);

  return (
    <div className="flex flex-col rounded-lg border border-slate-200 p-4 shadow-md">
      {/* TODO: list topic details here*/}
      <hr className="my-4" />

      <div className="flex gap-4">
        <button
          name="assign"
          type="button"
          className={clsx("rounded py-2 px-4 text-white ", {
            "bg-purple-500 hover:bg-purple-600": assignee !== undefined,
            "bg-green-500 hover:bg-green-600": assignee === undefined,
          })}
          onClick={() => {
            // TODO: implement onClick handler
          }}
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

      <div className="flex flex-col gap-4">{/* TODO: list comments here*/}</div>
      {/* TODO: add CommentForm*/}
      <hr className="my-4" />
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
