import { KitchenSink } from "./pages/KitchenSink";
import { FormsControlled } from "./pages/FormsControlled";
import { FormsHookForm } from "./pages/FormsHookForm";
import { Events } from "./pages/Events";

/**
 * Path-based micro router. `vite preview` serves index.html for every
 * path (SPA fallback), so plain anchors work for navigation.
 */
export function App() {
  const path = window.location.pathname;

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
      return (
        <main>
          <h1>NYSDS React example</h1>
          <ul>
            <li>
              <a href="/kitchen-sink">Kitchen sink</a>
            </li>
            <li>
              <a href="/forms/controlled">Forms (controlled)</a>
            </li>
            <li>
              <a href="/forms/hook-form">Forms (React Hook Form)</a>
            </li>
            <li>
              <a href="/events">Events</a>
            </li>
          </ul>
        </main>
      );
  }
}
