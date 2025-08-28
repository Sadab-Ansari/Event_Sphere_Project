// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
import "../app/globals.css";
import ClientProviders from "@/components/ClientProviders";
import { Suspense } from "react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Event Sphere</title>
      </head>
      <body className="flex flex-col min-h-screen">
        <Suspense fallback={null}>
          <ClientProviders>
            {/* <Navbar /> */}
            <main className="flex-1">{children}</main>
            {/* <Footer /> */}
          </ClientProviders>
        </Suspense>
      </body>
    </html>
  );
}
