import type { Like, Topic, User } from "@prisma/client";
import { Link, useFetcher } from "@remix-run/react";
import { useCallback } from "react";

type TopicCardProps = {
    id: Topic["id"]
    title: Topic["title"];
    description: Topic["description"];
    likes?: Array<Like>;
    assignee?: User["email"];
    userId: User["id"];
}

export const TopicCard = ({ id, title, description, likes = [], assignee = '', userId }: TopicCardProps) => {
    const fetcher = useFetcher();

    const handleCreateLike = useCallback((id: Topic["id"]) => {
        fetcher.submit(
        { topic_id: id },
        { action: 'action/create-like', method: 'post' },
      );
    }, [fetcher])

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
                        overflow: "hidden"
                    }}
                >
                    {description}
                </p>
            </Link>

            <div className="flex w-full justify-between items-center">
                <span className="text-sm">Assignee: {assignee}</span>
                <div className="flex gap-4 items-center">
                    <span>Likes: {likes.length}</span>
                    <button 
                        className={`rounded-md shadow-md p-2 ${likes.some((like) => like.userId === userId) && 'opacity-50'}`} 
                        onClick={() => handleCreateLike(id)} 
                        disabled={likes.some((like) => like.userId === userId)}
                    >👍
                    </button>
                </div>
            </div>
        </div>
    )
};