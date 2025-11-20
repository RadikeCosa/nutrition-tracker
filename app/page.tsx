import Link from "next/link";

export default function Home() {
  return (
    <>
      <main>
        <h1>Bienvenido a Nutrition Tracker</h1>
        <nav>
          <ul>
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/form">Form</Link>
            </li>
          </ul>
        </nav>
      </main>
    </>
  );
}
