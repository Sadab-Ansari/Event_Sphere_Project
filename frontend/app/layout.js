import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "../app/globals.css";
import PathChecker from "@/components/PathChecker"; // Import the client component

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <PathChecker>
          <Navbar /> {/* Navbar will be hidden on /dashboard */}
        </PathChecker>
        <main className="flex-1">{children}</main>{" "}
        {/* Page content is always visible */}
        <PathChecker>
          <Footer /> {/* Footer will be hidden on /dashboard */}
        </PathChecker>
      </body>
    </html>
  );
}
