import type { ReactNode } from "react";
import { NysGlobalHeader } from "@nysds/react";
import { KitchenSink } from "./pages/KitchenSink";
import { FormsControlled } from "./pages/FormsControlled";
import { FormsHookForm } from "./pages/FormsHookForm";
import { Events } from "./pages/Events";

const NAV = [
  { href: "/kitchen-sink", label: "Kitchen sink" },
  { href: "/forms/controlled", label: "Forms: controlled" },
  { href: "/forms/hook-form", label: "Forms: hook form" },
  { href: "/events", label: "Events" },
];

/**
 * Shared page shell: NYSDS global header with the app name and page
 * navigation, plus a centered content column.
 */
function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <NysGlobalHeader
        appName="React + Vite example"
        agencyName="New York State Design System"
        homepageLink="/"
      >
        <ul>
          {NAV.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </NysGlobalHeader>
      <main className="nys-grid-container nys-padding-y-400">{children}</main>
    </>
  );
}

function Home() {
  return (
    <>
      <h1>NYSDS React + Vite example</h1>
      <p>
        Proves <code>@nysds/react</code> in a Vite single-page app. Each page
        exercises one part of the integration.
      </p>
      <ul>
        {NAV.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </>
  );
}

/**
 * Path-based micro router. `vite preview` serves index.html for every
 * path (SPA fallback), so plain anchors work for navigation.
 */
export function App() {
  const path = window.location.pathname;

  const page = (() => {
    switch (path) {
      case "/kitchen-sink":
        return <KitchenSink />;
      case "/forms/controlled":
        return <FormsControlled />;
      case "/forms/hook-form":
        return <FormsHookForm />;
      case "/events":
        return <Events />;
      default:
        return <Home />;
    }
  })();

  return <Shell>{page}</Shell>;
}
