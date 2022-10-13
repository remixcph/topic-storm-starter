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

1. `npm i`
2. update the `.env` file in the repo with the given credentials
3. `npm run dev`

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
