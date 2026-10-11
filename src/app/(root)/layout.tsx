// import Navbar from "../../../components/Navbar";
// import Footer from "../../../components/Footer";
// import { Toaster } from "react-hot-toast";

// export default function RootGroupLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <>
//     <Toaster
//   position="top-right"
//   reverseOrder={false}
//    />
//       <Navbar/>
//       <main className="flex-1">{children}</main>
//       <Footer />
//     </>
//   );
// }


import NavbarWrapper from "../../../components/NavbarWrapper";
import Footer from "../../../components/Footer";
import { Toaster } from "react-hot-toast";

export default function RootGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />

      <NavbarWrapper />

      <main className="flex-1">{children}</main>

      <Footer />
    </>
  );
}