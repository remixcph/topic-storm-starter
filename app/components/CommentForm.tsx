import { Form } from "@remix-run/react";
import React, { useEffect } from "react";

export function CommentForm({
  error,
  isAdding,
}: {
  error?: string;
  isAdding: boolean;
}) {
  const formRef = React.useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset();
    }
  }, [isAdding]);

  return (
    <Form
      ref={formRef}
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
          <span>Add Comment:</span>
          <input name="_method" type="hidden" value="create_comment" />
          <textarea
            name="comment"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
            aria-invalid={error ? true : undefined}
            aria-errormessage={error ? "commnet-error" : undefined}
          />
        </label>
        {error && (
          <div className="pt-1 text-red-700" id="commnet-error">
            {error}
          </div>
        )}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Add Comment
        </button>
      </div>
    </Form>
  );
}
