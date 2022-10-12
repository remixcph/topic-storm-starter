import { useCallback, useMemo } from "react";
import type { Like, Topic, User } from "@prisma/client";
import { Link, useFetcher } from "@remix-run/react";
import { clsx } from "clsx";

type TopicCardProps = {
  topic: ExtendedTopic;
  userId: User["id"];
};

export const TopicCard = ({ topic, userId }: TopicCardProps) => {
  const fetcher = useFetcher();

  const handleCreateLike = useCallback(
    (id: Topic["id"]) => {
      fetcher.submit(
        { topic_id: id },
        { action: "action/create-like", method: "post" }
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

      <div className="flex w-full items-center justify-between">
        <span className="text-sm">
          Assignee:{" "}
          {topic.assignees.map((assignee) => assignee.user.email).join(", ")}
        </span>
        <div className="flex items-center gap-4">
          <span>Likes: {topic.likes.length}</span>
          <button
            className={`rounded-md p-2 shadow-md ${
              topic.likes.some((like) => like.userId === userId) && "opacity-50"
            }`}
            onClick={() => handleCreateLike(topic.id)}
            disabled={topic.likes.some((like) => like.userId === userId)}
          >
            👍
          </button>
        </div>
      </div>
    </div>
  );
};
