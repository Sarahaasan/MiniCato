
"use client";
import toast from "react-hot-toast";
import Link from "next/link";
import { Cairo } from "next/font/google";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaHome,FaUserTie,FaRobot,FaFileContract,FaSearch,
  FaCalendarCheck,
} from "react-icons/fa";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "900"],
});

// logo 
const LOGO_SRC = "/locales/images/loogo.png";

// Edit the hrefs to match your routes
const NAV_LINKS = [
  { label: "الرئيسية", href: "/", icon: FaHome },
  { label: "التحقق", href: "/lawyers", icon: FaUserTie  ,},
  { label: " طلبات السحب", href: "/assistant", icon: FaRobot },
  { label: "النزاعات ", href: "/contracts", icon: FaFileContract },
  { label: "المستخدمون", href: "/legal-search", icon: FaSearch },
];
const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [choosed , setchoosed] = useState("الرئيسية")



// eslint warning 
useEffect(() => {
   // eslint-disable-next-line react-hooks/set-state-in-effect
  setIsLoggedIn(!!localStorage.getItem("token"));
}, []);

  // slightly reduce opacity on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock page scroll 
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
    window.location.reload();
  };

const handleProtectedClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
  if (!isLoggedIn) {
    e.preventDefault(); // stop navigation
    toast.error("يجب عليك تسجيل الدخول أولاً");
    setIsOpen(false); // closes the mobile sidebar if it's open
  }
};
  return (
    < div >
      <nav 
      
        dir="rtl"
        className={`${cairo.className}  fixed inset-x-0 top-0 z-40 w-full border-b border-[#E2E8E4] backdrop-blur-md transition-all duration-300 ${
          scrolled ? "bg-[#FAF9F5]/80 shadow-sm" : "bg-[#FAF9F5]"
        }`}
      >
        <div className="mx-auto flex max-w-350 items-center justify-between gap-3 px-4 py-2">
          {/* LOGO (right side in RTL) */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
           <Image
  src={LOGO_SRC}
  alt="مينيكاتو"
  width={48}
  height={48}
  priority
  className="h-12 w-12 rounded-full border  object-cover"
/>
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-2">
                <span className="whitespace-nowrap text-2xl font-black text-[#1B3B2B]">
                  مينيكاتو
                </span>
                <span className="whitespace-nowrap rounded-full border border-[#C5A059]/50 bg-[#C5A059]/10 px-2 py-0.5 text-[10px] font-semibold text-[#1B3B2B]">
                  Minicato AI
                </span>
              </div>
              <span className="hidden whitespace-nowrap text-[11px] text-[#5F6B64] sm:block">
                ذكاء اصطناعي ونخبة المحامين المعتمدين
              </span>
            </div>
          </Link>

          {/* MAIN LINKS */}
          <div className="hidden items-center gap-1 xl:flex">
            {NAV_LINKS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                // className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-[#1A201C] transition-colors duration-200 hover:bg-[#F5E6C8] hover:text-[#1B3B2B]"
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-[#1A201C] transition-colors duration-200 hover:bg-[#F5E6C8] hover:text-[#1B3B2B] ${
              choosed === label
                ? "border-[#C5A059] bg-[#C5A059]/10 text-[#1B3B2B]"
                : "border-[#E2E8E4] text-[#5A655E]"
            }`}
              >
                <Icon className="text-base text-[#C5A059]" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* DESKTOP BUTTONS */}
          <div className="hidden shrink-0 items-center gap-2 xl:flex">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="whitespace-nowrap rounded-lg bg-[#e44949] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#c93a3a]"
              >
                تسجيل الخروج
              </button>
            ) : (
              <Link
                href="/login"
                className="whitespace-nowrap rounded-lg border border-[#1B3B2B] px-4 py-2 text-sm font-semibold text-[#1B3B2B] transition-all duration-200 hover:bg-[#1B3B2B] hover:text-white"
              >
                تسجيل الدخول
              </Link>
            )}

            <Link
              href="/"
              onClick={handleProtectedClick}
              className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-[#1B3B2B] px-4 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[#14301f]"
            >
              <FaCalendarCheck className="text-[#C5A059]" />
              احجز محامي الآن
            </Link>
          </div>

          {/* HAMBURGER */}
          <button
            onClick={() => setIsOpen(true)}
            className="rounded-lg p-2 text-[#1B3B2B] hover:bg-gray-200 xl:hidden"
            aria-label="فتح القائمة"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* MOBILE SIDEBAR — rendered OUTSIDE <nav> so the nav's backdrop-blur
          doesn't trap this fixed element inside the navbar's height */}
      {isOpen && (
        <div dir="rtl" className={`${cairo.className} fixed inset-0 z-[60] xl:hidden`}>
          {/* Dark overlay */}
          <div
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          {/* Sidebar */}
          <div className="absolute right-0 top-0 flex h-full w-72 max-w-[85vw] flex-col overflow-y-auto bg-[#FAF9F5] p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-[#1B3B2B]">منيكاتو</span>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-2xl leading-none text-[#1B3B2B] hover:bg-gray-200"
                aria-label="إغلاق القائمة"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-1">
              {NAV_LINKS.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-semibold text-[#1A201C] transition-colors hover:bg-[#F5E6C8]"
                >
                  <Icon className="text-lg text-[#C5A059]" />
                  {label}
                </Link>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/"
                // onClick={() => setIsOpen(false)}
                onClick={handleProtectedClick}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#1B3B2B] px-5 py-3 text-sm font-bold text-white hover:bg-[#14301f]"
              >
                <FaCalendarCheck className="text-[#C5A059]" />
                احجز محامي الآن
              </Link>

              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="rounded-lg bg-[#e44949] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#c93a3a]"
                >
                  تسجيل الخروج
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg border border-[#1B3B2B] px-5 py-2.5 text-center text-sm font-semibold text-[#1B3B2B] hover:bg-[#1B3B2B] hover:text-white"
                  >
                    تسجيل الدخول
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
