import type { Metadata } from "next";
import "./globals.css";
import { DM_Sans } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";

const dmSans = DM_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PollMate",
  description:
    "Pollmate is a dynamic platform for creating, sharing, and participating in engaging polls. Discover trending topics, vote in real-time, and gain insights with interactive analytics. Perfect for gathering opinions, making decisions, and driving conversations. Join Pollmate today and power your voice!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.className} antialiased max-w-screen-xl flex flex-col items-center mx-auto w-full`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
