import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>NYSDS Next.js example</h1>
      <ul>
        <li>
          <Link href="/kitchen-sink">Kitchen sink</Link>
        </li>
        <li>
          <Link href="/forms">Forms</Link>
        </li>
        <li>
          <Link href="/events">Events</Link>
        </li>
      </ul>
    </main>
  );
}
