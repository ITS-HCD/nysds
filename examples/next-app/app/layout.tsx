import "@nysds/styles";
import type { ReactNode } from "react";

export const metadata = {
  title: "NYSDS Next.js example",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
