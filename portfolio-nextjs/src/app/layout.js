import { Fira_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import "@uploadthing/react/styles.css";
import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageLayoutWrapper from "@/components/PageLayoutWrapper";

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
  title: "Infinita Poesia | Design Portfolio",
  description: "Portfólio de Design Gráfico e Produto por Renato Cardoso",
};


export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body
        className={`${firaSans.variable} ${sourceSerif.variable} font-sans antialiased bg-white text-[#333]`}
      >
        <div className="min-h-screen flex flex-col">
          <PageLayoutWrapper>
            {children}
          </PageLayoutWrapper>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
