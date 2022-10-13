# Topic Storm Starter 🎉

Welcome to Remix Copenhagen.

In this repo you'll find all you need to get started on your (maybe) first Remix application.

## The App you'll build

Topic Storm: an app used to brain storm new topic ideas for the upcoming meetups.

**Main features are**

- Users can sign-up and login 🔒
- Users can see topics suggested by other users 🗒️
- Users can vote on topics 👍
- Users can comment on topics 🌱
- users can assign themselves to topics 🫂

The app looks like this:

<img width="500" alt="Screenshot 2022-10-13 at 09 42 39" src="https://user-images.githubusercontent.com/14864439/195533592-bf522083-e8db-4339-b9b6-a882a9a8a6b4.png">

## Getting Started

To build this app you'll need to go through several small tasks.

We'll provide you with a base repository which already contains

- Signup and login
- Main components
- Prisma schema and a remote database connection (yes, the database is live!)

Your aim is to add the missing features which should touch on the most relevant points of Remix.

Let's get into it!

1. Fork this repo
2. Setup
```
// run
npm i

// update the `.env` file in the repo with the given credentials

// run
npx prisma generate

// run
npm run dev
```
3. Update `/topics` so it renders an Outlet for the nested routes.
4. In `/topics/index` add a loader to fetch the topics and return them. Finally, render the topics using the TopicCard component.
5. In the route `/routes/topics/index` add a form (components/TopicForm) and an action function to create new topic.
6. Update route in routes/topics/$topicId to display the topic details (title and description).
7. In `routes/topics/$topicId` list assignees for a topic. Create a button to assign to be able to assign/unassign your user to/from a topic. Update the commented out functions and the action code to persist the assignees. 
8. In `routes/topics/$topicId` list the comments of the topic.
9. Add form (CommentForm) for creating comments and update the action function.
10. In  routes/topics/index add input field for searching topics, onChange handler which will use set URL search params (use `setSearchParams` from hook `useSearchParams`). In loader get query search param and pass it to `getTopicListItems` to filter Topics
11. In TopicCard component implement `handleCreateLike` and `handleDeleteLike` and use `fetcher` to post to `action/create-like` and `action/delete-like` api routes to create and remove like from topic.


Bonus:
- Add the list sorting using the component TopicSort and update the backend to pass the url parameters in the query of the topics list.




## For deployment

- register to [fly.io](https://fly.io/)
- install [fly cli](https://fly.io/docs/hands-on/install-flyctl/)

```
fly auth login
fly apps create topic-storm
fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app topic-storm
fly secrets set DATABASE_URL=SUPERSECRET --app topic-storm
fly launch
```


Super secret
``` 
DATABASE_URL"postgresql://remixcph:remixcph-workshop-20221013@34.107.125.99:5432/remixcph"
```
