import { Fira_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import "@uploadthing/react/styles.css";
import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageLayoutWrapper from "@/components/PageLayoutWrapper";
import { PHProvider } from "./providers";
import PostHogPageView from "@/components/PostHogPageView";


const firaSans = Fira_Sans({
  variable: "--font-fira",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: 'Infinita Poesia /*',
  description: 'Criação de marcas e produtos',
  icons: {
    icon: 'https://41fyotqqdf.ufs.sh/f/047OTbUFRaz7KlwOFcqeiax41Jgf9kWy5wsLXTcmG7zvF8Bl',
  },
  openGraph: {
    title: 'Infinita Poesia',
    description: 'Desenhos e ideias',
    url: 'https://infinitapoesia.com.br',
    type: 'website',
    images: [
      {
        url: 'https://41fyotqqdf.ufs.sh/f/047OTbUFRaz7Wn9vmdIBGVeIToJiAt53FCzgjmQnybO0UqRH',
        width: 1200,
        height: 630,
      },
    ],
  },
};





export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body
        className={`${firaSans.variable} ${sourceSerif.variable} font-sans antialiased bg-white text-[#333]`}
      >
        <PHProvider>
          <PostHogPageView />
          <div className="min-h-screen flex flex-col">
            <PageLayoutWrapper>
              {children}
            </PageLayoutWrapper>
          </div>
          <Analytics />
        </PHProvider>
      </body>
    </html>
  );
}
