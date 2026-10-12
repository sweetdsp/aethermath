import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AetherMath – Learn Math Interactively",
  description:
    "Interactive lessons, live graphs, algebra-aware practice and a Socratic AI tutor.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("aether-theme");if(t)document.documentElement.classList.add(t)}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
