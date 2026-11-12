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
  metadataBase: new URL('https://presentation-j7hiar119-renatocardosos-projects.vercel.app'),
  title: 'Apresentação 2027',
  description: 'Ideias e projetos para lançamento em 2027.',
  icons: {
    icon: 'https://41fyotqqdf.ufs.sh/f/047OTbUFRaz7QE7OGw1c6gedqP1zGVAfm5p4aShYIjUxZb7O',
  },
  openGraph: {
    title: '2027 Presentation',
    description: 'Ideas and projects to be lauched in 2027.',
    url: '/en',
    siteName: '/* Infinita Poesia',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Pré-visualização do projeto',
      },
    ],
    locale: 'en_US',
    type: 'website',
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
