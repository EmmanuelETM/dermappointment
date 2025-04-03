import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Providers from "./providers";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "DermAppointment",
  description:
    "This is an Appointment Scheduling system for a Dermatological Center",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <body className={cn("min-h-screen bg-background antialiased")}>
        <Providers>{children} </Providers>
      </body>
    </html>
  );
}
