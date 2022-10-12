type CommentProps = {
  content: string;
  author: string;
};

export function Comment({ author, content }: CommentProps) {
  return (
    <div className="flex flex-col rounded-md p-4 shadow-md">
      <p
        className="my-6"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {content}
      </p>

      <div className="flex w-full items-center justify-between">
        <span className="text-sm">Author: {author}</span>
      </div>
    </div>
  );
}
