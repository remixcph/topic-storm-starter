import { useCallback, useMemo } from "react";
import type { Like, Topic, User } from "@prisma/client";
import { Link, useFetcher } from "@remix-run/react";
import type { ExtendedTopic } from "~/models/topic.server";
import { clsx } from "clsx";

type TopicCardProps = {
  topic: ExtendedTopic;
  userId: User["id"];
};

export const TopicCard = ({ topic, userId }: TopicCardProps) => {
  // const fetcher = useFetcher(); // uncomment to use fetcher

  const like = useMemo(
    () => topic.likes.find((like) => like.userId === userId),
    [topic.likes, userId]
  );

  const handleCreateLike = useCallback(
    (id: Topic["id"]) => {
      // TODO: use fetcher to create like, call action: action/create-like
    },
    []
  );

  const handleDeleteLike = useCallback(
    (id: Like["id"]) => {
      // TODO: use fetcher to delete like, call action: action/delete-like
    },
    []
  );
  return (
    <div className="flex flex-col rounded-lg border border-slate-200 p-4 shadow-md hover:bg-slate-50">
      <Link className="block p-4 text-xl" to={topic.id}>
        <h3 className="text-2xl font-bold">{topic.title}</h3>

        <p
          className="my-6"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {topic.description}
        </p>
      </Link>

      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm">💬 Comments: {topic.comments.length}</span>
          <span>👍 Likes: {topic.likes.length}</span>
          <span>🙋‍♂️ 🙋‍♀️ Assignees: {topic.assignees.length}</span>
        </div>

        <button
          className={clsx("rounded-md p-2 shadow-md hover:bg-yellow-100", {
            "opacity-50": like,
          })}
          onClick={() =>
            like ? handleDeleteLike(like.id) : handleCreateLike(topic.id)
          }
        >
          {like ? "👎" : "👍"}
        </button>
      </div>
    </div>
  );
};
