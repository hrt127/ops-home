import { getCsrfToken } from "next-auth/react";

export default async function SignIn() {
  const csrfToken = await getCsrfToken();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form method="post" action="/api/auth/callback/credentials" className="bg-zinc-900 p-8 rounded shadow-md w-80">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <h1 className="text-lg font-bold mb-4">Sign in</h1>
        <label className="block mb-2">Email</label>
        <input name="email" type="email" className="w-full mb-4 p-2 rounded bg-zinc-800 border border-zinc-700" />
        <label className="block mb-2">Password</label>
        <input name="password" type="password" className="w-full mb-4 p-2 rounded bg-zinc-800 border border-zinc-700" />
        <button type="submit" className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded">Sign in</button>
      </form>
    </div>
  );
}
