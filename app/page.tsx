import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-melon mb-6 text-center">
        Bienvenido a Nutrition Tracker
      </h1>
      <nav className="bg-peach rounded-lg shadow p-6 mb-8">
        <ul className="flex gap-6 justify-center flex-wrap">
          <li>
            <Link
              href="/dashboard"
              className="text-lg font-semibold text-gray-800 hover:text-melon transition-colors no-underline"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/form"
              className="text-lg font-semibold text-gray-800 hover:text-melon transition-colors no-underline"
            >
              Form
            </Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
