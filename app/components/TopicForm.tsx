import { Form, useActionData, useTransition } from "@remix-run/react";
import React, { useEffect } from "react";
import type { action } from "~/routes/topics/new";

export function TopicForm({ redirectTo }: { redirectTo?: string }) {
  const actionData = useActionData<typeof action>();
  const formRef = React.useRef<HTMLFormElement>(null);
  const titleRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);
  const transition = useTransition();

  const isAdding = transition.state === "submitting";

  useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset();
    }
  }, [isAdding]);

  useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.description) {
      descriptionRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      ref={formRef}
      method="post"
      action="/topics/new"
      className="flex w-full flex-col gap-6"
    >
      <input hidden name="redirect_to" defaultValue={redirectTo} />

      <h3 className="text-xl font-bold">Add new topic</h3>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Topic title: </span>
          <input
            ref={titleRef}
            name="title"
            className="flex-1 rounded-lg border-2 border-slate-300 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.title ? true : undefined}
            aria-errormessage={
              actionData?.errors?.title ? "title-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.title && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData?.errors.title}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Description: </span>
          <textarea
            ref={descriptionRef}
            name="description"
            rows={4}
            className="w-full flex-1 rounded-lg border-2 border-slate-300 py-2 px-3 text-lg leading-6"
            aria-invalid={actionData?.errors?.description ? true : undefined}
            aria-errormessage={
              actionData?.errors?.description ? "description-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.description && (
          <div className="pt-1 text-red-700" id="description-error">
            {actionData?.errors.description}
          </div>
        )}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Add Topic
        </button>
      </div>
    </Form>
  );
}
