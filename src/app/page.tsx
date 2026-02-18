import Link from "next/link";

export default function Home() {  
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-900">
      <div className="w-full max-w-md px-8 text-center">
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
            Choza Solutions
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8 text-lg">
            Welcome to the hotel management platform.
          </p>
          
          <Link
            href="/login"
            className="inline-block w-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 py-3 px-6 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 focus:ring-offset-2"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
