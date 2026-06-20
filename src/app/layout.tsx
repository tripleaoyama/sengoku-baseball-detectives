import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "戦国武将ベースボール探偵団",
  description: "小2向けの算数・読解ミッションWebアプリ",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
