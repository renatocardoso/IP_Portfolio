import { Noto_Sans, Fira_Sans } from "next/font/google";
import "./globals.css";
import "@uploadthing/react/styles.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageLayoutWrapper from "@/components/PageLayoutWrapper";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const firaSans = Fira_Sans({
  variable: "--font-fira",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata = {
  title: "Infinita Poesia | Design Portfolio",
  description: "Portfólio de Design Gráfico e Produto por Renato Cardoso",
};


export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body
        className={`${notoSans.variable} ${firaSans.variable} font-sans antialiased bg-white text-[#333]`}
      >
        <div className="min-h-screen flex flex-col">
          <PageLayoutWrapper>
            {children}
          </PageLayoutWrapper>
        </div>
      </body>
    </html>
  );
}
