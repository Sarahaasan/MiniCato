

import Link from "next/link";
import Image from "next/image";
import { Cairo } from "next/font/google";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "900"],
});

const LOGO_SRC = "/locales/images/loogo.png";

const QUICK_LINKS = [
  { label: "الرئيسية", href: "/" },
  { label: "دليل المحامين المعتمدين", href: "/" },
  { label: "المساعد القانوني AI", href: "/" },
  { label: "تحليل وتنفيذ العقود", href: "/" },
  { label: "مساحة المحامي", href: "/" },
];

const SPECIALTIES = [
  { label: "قضايا الشركات والعقود التجاري", href: "/" },
  { label: "النزاعات العمالية ومكافآت الخدمة", href: "/" },
  { label: "العقارات وعقود الإيجار", href: "/" },
  { label: "الأحوال الشخصية والتركات", href: "/" },
];

const Footer = () => {
  return (
    <footer dir="rtl" className={`${cairo.className} bg-[#1B3B2B] text-white`}>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          {/* BRAND */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <Image
                src={LOGO_SRC}
                alt="مينيكاتو"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full border border-white/20 object-cover"
              />
              <span className="text-2xl font-black">
                مينيكاتو | Minicato
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-7 text-gray-300">
              منصة الذكاء الاصطناعي القانونية الأولى المصممة لربط العملاء
              بالمحامين المعتمدين، تحليل العقود، وتبسيط التشريعات.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="mb-4 text-base font-bold text-[#C5A059]">
              الوصول السريع
            </h3>
            <div className="flex flex-col gap-3 text-sm text-gray-200">
              {QUICK_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="transition hover:text-[#C5A059]"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* SPECIALTIES */}
          <div>
            <h3 className="mb-4 text-base font-bold text-[#C5A059]">
              التخصصات القضائية
            </h3>
            <div className="flex flex-col gap-3 text-sm text-gray-200">
              {SPECIALTIES.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="transition hover:text-[#C5A059]"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* SECURITY & LICENSING */}
          <div>
            <h3 className="mb-4 text-base font-bold text-[#C5A059]">
              الأمان والترخيص
            </h3>
            <div className="rounded-xl border border-[#2A543E] bg-white/5 p-4 text-sm leading-7 text-gray-200">
              تراخيص معتمدة من وزارة العدل وهيئة المحامين. تشفير عالي الدقة
              للبيانات.
            </div>

            <p className="mt-6 text-xs text-gray-400">
              © 2026 منيكاتو LegalTech. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;