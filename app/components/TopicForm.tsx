import { Form } from "@remix-run/react";
import React from "react";

type TopicFormProps = {
  errors?: {
    title?: string | null;
    description?: string | null;
  };
};

export function TopicForm({ errors }: TopicFormProps) {
  const titleRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (errors?.title) {
      titleRef.current?.focus();
    } else if (errors?.description) {
      descriptionRef.current?.focus();
    }
  }, [errors?.title, errors?.description]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Topic title: </span>
          <input
            ref={titleRef}
            name="title"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={errors?.title ? true : undefined}
            aria-errormessage={errors?.title ? "title-error" : undefined}
          />
        </label>
        {errors?.title && (
          <div className="pt-1 text-red-700" id="title-error">
            {errors.title}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Description: </span>
          <textarea
            ref={descriptionRef}
            name="description"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
            aria-invalid={errors?.description ? true : undefined}
            aria-errormessage={
              errors?.description ? "description-error" : undefined
            }
          />
        </label>
        {errors?.description && (
          <div className="pt-1 text-red-700" id="description-error">
            {errors.description}
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
