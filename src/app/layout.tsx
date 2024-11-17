import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ subsets: ["latin"] });

const DynamicBackground = dynamic(() => import('@/components/DynamicBackground'), {
  ssr: false
});

export const metadata = {
  title: "NEARide - Next-Gen Smart Contract IDE",
  description: "AI-powered IDE for deploying smart contracts to NEAR Protocol",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white min-h-screen relative overflow-x-hidden`}>
        <DynamicBackground />
        <div className="relative z-10">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}