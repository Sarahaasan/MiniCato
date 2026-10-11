"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const Navbar = dynamic(() => import("./Navbar"), {
  ssr: false,
});

const AdminNavbar = dynamic(() => import("./AdminNavbar"), {
  ssr: false,
});

export default function NavbarWrapper() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return <AdminNavbar />;
  }

  return <Navbar />;
}