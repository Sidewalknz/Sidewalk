import { Montserrat, Freehand, Gloria_Hallelujah, Bree_Serif} from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const freehand = Bree_Serif({
  weight: "400",
  variable: "--font-freehand",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sidewalk",
  description: "Sidewalk is a Nelson-based web design duo crafting custom websites, branding, and digital experiences that last.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${freehand.variable}`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
