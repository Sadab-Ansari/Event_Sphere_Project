import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
import "../app/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navbar />{" "}
        {/* Always present except on /dashboard (handled inside Navbar) */}
        <main className="flex-1">{children}</main> {/* Page content */}
        {/* <Footer />{" "} */}
        {/* Always present except on /dashboard (handled inside Footer) */}
      </body>
    </html>
  );
}
