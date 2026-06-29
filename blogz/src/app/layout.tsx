import type { Metadata } from "next";
import type { ReactNode } from "react";
import Providers from "./provider"; 
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "../components/Navbar";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "Blogz",
  description: "whatever you want to write",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<html lang="en">
      <body>
        <Navbar />
        <Providers>
          {children}
        </Providers> 
      </body> 
    </html>
  );
}