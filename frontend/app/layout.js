// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
import "../app/globals.css";
import { SocketProvider } from "@/context/SocketContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <SocketProvider>
          {/* <Navbar /> */}
          <main className="flex-1">{children}</main> {/* Page content */}
          {/* <Footer /> */} {/* Uncomment if needed */}
        </SocketProvider>
      </body>
    </html>
  );
}
