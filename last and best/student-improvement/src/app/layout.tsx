import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { ToastProvider } from "../components/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudyFlow - Student Productivity App",
  description: "Transform your academic journey with AI-powered focus sessions and task management",
  keywords: "student productivity, study app, pomodoro timer, task management, habit tracking, budget tracker",
  authors: [{ name: "StudyFlow Team" }],
  creator: "StudyFlow",
  publisher: "StudyFlow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com",
    title: "StudyFlow - Student Productivity App",
    description: "Transform your academic journey with AI-powered focus sessions and task management",
    siteName: "StudyFlow",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StudyFlow - Student Productivity App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StudyFlow - Student Productivity App",
    description: "Transform your academic journey with AI-powered focus sessions and task management",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
