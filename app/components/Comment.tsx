type CommentProps = {
  content: string;
  author: string;
};

export function Comment({ author, content }: CommentProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-md">
      <p>{content}</p>

      <div className="flex w-full items-center justify-between">
        <span className="text-sm">✏️ {author}</span>
      </div>
    </div>
  );
}
