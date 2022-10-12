import { useCallback, useMemo } from "react";
import type { Like, Topic, User } from "@prisma/client";
import { Link, useFetcher } from "@remix-run/react";
import { clsx } from "clsx";

type TopicCardProps = {
  id: Topic["id"];
  title: Topic["title"];
  description: Topic["description"];
  likes?: Array<Like>;
  userId: User["id"];
};

export const TopicCard = ({
  id,
  title,
  description,
  likes = [],
  userId,
}: TopicCardProps) => {
  const fetcher = useFetcher();

  const like = useMemo(
    () => likes.find((like) => like.userId === userId),
    [likes, userId]
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
    <div className="flex flex-col rounded-md p-4 shadow-md">
      <Link className={`} block p-4 text-xl`} to={id}>
        <h3 className="text-2xl font-bold">{title}</h3>

        <p
          className="my-6"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </p>
      </Link>

      <div className="flex w-full items-center justify-end">
        <div className="flex items-center gap-4">
          <span>Likes: {likes.length}</span>
          <button
            className={clsx("rounded-md p-2 shadow-md", {
              "opacity-50": like,
            })}
            onClick={() =>
              like ? handleDeleteLike(like.id) : handleCreateLike(id)
            }
          >
            {like ? "👎" : "👍"}
          </button>
        </div>
      </div>
    </div>
  );
};
