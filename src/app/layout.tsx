import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beyond Silence — Human perspectives, at your pace",
  description: "A frontend concept prototype for private understanding, fictional lived experiences, and a user-chosen next step.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
