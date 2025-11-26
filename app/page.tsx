import Link from "next/link";

export default function Home() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: "var(--color-background)",
        color: "var(--color-primary)",
      }}
    >
      <div className="w-full max-w-xl flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold text-center text-(--color-accent) mb-2 tracking-tight">
          Bienvenido a Nutrition Tracker
        </h1>
        <div className="flex gap-6 justify-center w-full mt-6">
          <Link
            href="/dashboard"
            className="inline-block text-lg font-semibold px-6 py-2 rounded-lg bg-(--color-accent) text-white shadow transition-colors hover:bg-(--color-accent)/80 focus:outline-none focus:ring-2 focus:ring-(--color-accent) border border-(--color-accent)"
            style={{ textDecoration: "none" }}
          >
            Dashboard
          </Link>
          <Link
            href="/form"
            className="inline-block text-lg font-semibold px-6 py-2 rounded-lg bg-(--color-surface) text-(--color-primary) shadow transition-colors hover:bg-(--color-accent)/10 hover:text-(--color-accent) focus:outline-none focus:ring-2 focus:ring-(--color-accent) border border-(--color-accent)"
            style={{ textDecoration: "none" }}
          >
            Form
          </Link>
        </div>
      </div>
    </main>
  );
}
