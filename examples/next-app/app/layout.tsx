import "@nysds/styles/full";
import "./app.css";
import Link from "next/link";
import type { ReactNode } from "react";
import { NysGlobalHeader } from "@nysds/react";

export const metadata = {
  title: "NYSDS Next.js example",
};

const NAV = [
  { href: "/kitchen-sink", label: "Kitchen sink" },
  { href: "/forms", label: "Forms" },
  { href: "/events", label: "Events" },
];

/**
 * Shared page shell: NYSDS global header with the app name and page
 * navigation, plus a centered content column.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NysGlobalHeader
          appName="Next.js example"
          agencyName="New York State Design System"
          homepageLink="/"
        >
          <ul>
            {NAV.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </NysGlobalHeader>
        <main className="nys-grid-container nys-padding-y-400">{children}</main>
      </body>
    </html>
  );
}
