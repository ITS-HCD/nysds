import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>NYSDS Next.js example</h1>
      <p>
        Proves <code>@nysds/react</code> in a Next.js App Router app. Each page
        exercises one part of the integration.
      </p>
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
    </>
  );
}
