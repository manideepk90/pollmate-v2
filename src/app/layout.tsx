"use client";
import type { Metadata } from "next";
import "./globals.css";
import { DM_Sans } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";
import Clarity from "@microsoft/clarity";
import { useEffect } from "react";

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
}: {
  children: React.ReactNode;
}) {
  const clarityId = "owidwjugki";
  useEffect(() => {
    Clarity.init(clarityId);
  }, []);

  return (
    <html lang="en">
      <head>
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        {/* Add any default meta tags here */}

        {/* <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClientId}`}
          crossOrigin="anonymous"
        /> */}
      </head>
      <body
        className={`${dmSans.className} antialiased max-w-screen-xl flex flex-col items-center mx-auto w-full`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
