import { Form, Link, Outlet } from "@remix-run/react";

import { useUser } from "~/utils";

export default function TopicPage() {
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Remix CPH Meetup Topics</Link>
        </h1>

        <Form
          action="/logout"
          method="post"
          className="flex items-center gap-4"
        >
          <p>{user.email}</p>
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full flex-col overflow-auto bg-white p-6">
        {/* <Outlet /> */}
      </main>
    </div>
  );
}
