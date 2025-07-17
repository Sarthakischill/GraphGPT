import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { GraphDataProvider } from "@/context/GraphDataContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Chat History Visualizer Pro",
  description: "Transform your ChatGPT conversations into interactive 3D neural maps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} ${montserrat.className} antialiased font-sans`}>
        <GraphDataProvider>
          {children}
        </GraphDataProvider>
      </body>
    </html>
  );
}
