import { Geist, Geist_Mono } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Taskify",
  description: "Manage your tasks efficiently with Taskify.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <AppProvider>{children}</AppProvider>
        <Toaster />
      </body>
    </html>
  );
}
