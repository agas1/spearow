import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], 
  variable: "--font-poppins", 
});

export const metadata = {
  title: "Spearow- Pokédex", 
  description: "Aplicativo de busca e favoritos de Pokémons",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Use a variável da Poppins no className */}
      <body className={`${poppins.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}