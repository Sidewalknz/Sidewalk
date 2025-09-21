import Navbar from "./components/Navbar";

export default function SiteLayout({ children }) {
  // Note: nested layouts should NOT render <html>/<body>; only the root does.
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
