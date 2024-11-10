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
}: {
  children: React.ReactNode;
}) {
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+"${process.env.NEXT_PUBLIC_CLARITY_ID}";
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
            `,
          }}
        />
      </head>
      <body
        className={`${dmSans.className} antialiased max-w-screen-xl flex flex-col items-center mx-auto w-full`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
