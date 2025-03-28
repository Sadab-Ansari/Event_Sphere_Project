// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
import "../app/globals.css";
import ClientProviders from "@/components/ClientProviders"; // Use ClientProviders instead of SocketProvider

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <ClientProviders>
          {/* <Navbar /> */}
          <main className="flex-1">{children}</main> {/* Page content */}
          {/* <Footer /> */} {/* Uncomment if needed */}
        </ClientProviders>
      </body>
    </html>
  );
}
