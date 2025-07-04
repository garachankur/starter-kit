import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/providers/session-wrapper";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Next js Boilerplate",
  description: "Next js Boilerplate Description",
  keywords: "Next js Boilerplate",
  openGraph: {
    title: "Next js Boilerplate",
    description: "Next js Boilerplate Description",
    url: process.env.PUBLIC_URL,
    images: process.env.PUBLIC_URL + "images/laptop.jpg",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Next js Boilerplate",
    description: "Next js Boilerplate Description",
    images: process.env.PUBLIC_URL + "images/laptop.jpg",
  },
  icons: {
    icon: "/images/favicon.ico",
  },
  alternates: {
    canonical: process.env.PUBLIC_URL,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: false,
  minimumScale: 1,
  maximumScale: 1,
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className}  antialiased`} suppressHydrationWarning>
        <SessionWrapper>{children}</SessionWrapper>
        <Toaster />
      </body>
    </html>
  );
}
