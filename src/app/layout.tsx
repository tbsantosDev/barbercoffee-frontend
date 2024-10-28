'use client'
import { Roboto, Montserrat } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";


const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"], 
  variable: "--font-roboto",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-montserrat",
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT" className={`${roboto.variable} ${montserrat.variable}`}>
      <body className="antialiased bg-gradient-to-b from-[#a1b8b5] to-[#7c999d] text-white">
        <style jsx global>{`
          h1, h2, h3 {
            font-family: var(--font-montserrat), sans-serif;
          }
          body, p, input, button {
            font-family: var(--font-roboto), sans-serif;
          }
        `}</style>

        {children}

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
      </body>
    </html>
  );
}
