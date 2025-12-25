import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Ops Home",
  description: "Personal ops home for wallets, arenas, calendar, and agent console."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-gray-100">
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
