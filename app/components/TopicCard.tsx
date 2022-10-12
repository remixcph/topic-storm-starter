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
  const fetcher = useFetcher();

  const like = useMemo(
    () => topic.likes.find((like) => like.userId === userId),
    [topic.likes, userId]
  );

  const handleCreateLike = useCallback(
    (id: Topic["id"]) => {
      fetcher.submit(
        { topic_id: id },
        { action: "action/create-like", method: "post" }
      );
    },
    [fetcher]
  );

  const handleDeleteLike = useCallback(
    (id: Like["id"]) => {
      fetcher.submit(
        { like_id: id },
        { action: "action/delete-like", method: "post" }
      );
    },
    [fetcher]
  );
  return (
    <div className="flex flex-col rounded-md p-4 shadow-md hover:bg-white">
      <Link className={`block text-xl`} to={topic.id}>
        <h3 className="text-2xl font-bold hover:underline">{topic.title}</h3>
      </Link>

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

      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm">💬 Comments: {topic.comments.length}</span>
          <span>👍 Likes: {topic.likes.length}</span>
        </div>

        <button
          className={clsx("rounded-md p-2 shadow-md", {
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
