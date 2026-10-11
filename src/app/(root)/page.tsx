// // home
// import Link from "next/link"
// const page = () => {
//   return (
//     <main className="flex-1 mt-3.5">
//       <section className="bg-[#FAF9F5] px-6 py-20">
//         <div className="mx-auto max-w-7xl text-center">

//           <h1 className="text-5xl font-bold tracking-tight text-[#1B3B2B] md:text-6xl">
//             The Modern Smart Legal Platform
//           </h1>

//           <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#5A655E]">
//             Connect with trusted, verified lawyers through a secure and
//             seamless platform designed to make legal services simple,
//             transparent, and accessible.
//           </p>

//         <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
//             <Link href="/signup">
            
//   <button className="w-full max-w-[250px] rounded-lg bg-[#C5A059] px-6 py-3 font-semibold text-white transition hover:bg-[#B08C46]">
//     Create an Account
//   </button>
            
//             </Link>
//   <Link href="/login">
//   <button className="w-full max-w-[150px] rounded-lg border border-[#1B3B2B] px-6 py-3 font-semibold text-[#1B3B2B] transition hover:bg-[#1B3B2B] hover:text-white">
//     Log In
//   </button>
  
//   </Link>
// </div>

//           <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">

//             <div>
//               <h3 className="text-1xl font-bold text-[#C5A059]">
//                 100%
//               </h3>
//               <p className="mt-2 text-[#5A655E]">
//                 Professional & Secure
//               </p>
//             </div>

//             <div>
//               <h3 className="text-1xl font-bold text-[#C5A059]">
//                 Simple
//               </h3>
//               <p className="mt-2 text-[#5A655E]">
//                 Smooth & Easy Process
//               </p>
//             </div>

//             <div>
//               <h3 className="text-1xl font-bold text-[#C5A059]">
//                 Modern
//               </h3>
//               <p className="mt-2 text-[#5A655E]">
//                 Smart Legal Experience
//               </p>
//             </div>

//           </div>
//         </div>
//         <Link href="/admin">
//   <button className="w-full max-w-[150px] rounded-lg border border-[#1B3B2B] px-6 py-3 font-semibold text-[#1B3B2B] transition hover:bg-[#1B3B2B] hover:text-white">
//     admin
//   </button>
//   </Link>

// <br />

//         <Link href="/client">
//   <button className="w-full max-w-[150px] rounded-lg border border-[#1B3B2B] px-6 py-3 font-semibold text-[#1B3B2B] transition hover:bg-[#1B3B2B] hover:text-white">
//     client
//   </button>
//   </Link>
// <br />

//         <Link href="/lawyer">
//   <button className="w-full max-w-[150px] rounded-lg border border-[#1B3B2B] px-6 py-3 font-semibold text-[#1B3B2B] transition hover:bg-[#1B3B2B] hover:text-white">
//     lawyer
//   </button>
//   <br />
//   </Link>


//       </section>
//     </main>
//   );
// };

// export default page;
'use client'

// home
import Link from "next/link";
import { Cairo } from "next/font/google";
import { FaRobot, FaUserTie } from "react-icons/fa";
import Image from "next/image";
import toast from "react-hot-toast";
import { useState , useEffect } from "react";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "900"],
});

const LOGO_SRC = "/locales/images/loogo.png";

 const handleProtectedClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!localStorage.getItem("token")) {
      e.preventDefault(); // stop navigation
      toast.error("يجب عليك تسجيل الدخول أولاً");
    }
  }

const Page = () => {
const [logged, setLogged] = useState(false);



useEffect(() => {
  const checkToken = () => {
    setLogged(!!localStorage.getItem("token"));
  };

  checkToken();
}, []);


  return (
    <main dir="rtl" className={`${cairo.className} flex-1`}>
      <section className="bg-[#FAF9F5] px-6 pb-20 pt-32">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          {/* RIGHT: TEXT */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E2E8E4] bg-white px-4 py-2 text-sm font-semibold text-[#1B3B2B]">
              <span className="h-3 w-3 rounded-full bg-[#C5A059]/60" />
              جسرك الذكي الموثوق للتواصل مع نخبة المحامين المعتمدين
            </span>

            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-[#1B3B2B] md:text-6xl">
              رفيقك القانوني الذكي وصلتك المباشرة{" "}
              <span className="bg-[linear-gradient(to_left,#1B3B2B,#C5A059)] bg-clip-text text-transparent">
                بـ المحامين
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5A655E]">
              نبسط لك عالم القانون! استشر الذكاء الاصطناعي لفهم قضيتك مجاناً، أو
              احصل على توثيق واستشارة فورية مع محامين معتمدين متخصصين في كافة
              المجالات القضائية.
            </p>
         {!logged && (
  <div className="mt-2.5 flex items-center gap-3">
    <h2 className="text-2xl leading-8 text-[#5A655E]">
      انضم إلينا
    </h2>

    <Link
      href="/signup"
      className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#1B3B2B] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#14301f] sm:flex-none"
    >
      إنشاء حساب
    </Link>
  </div>
)}
            {/* SEARCH BOX */}
            <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-[#E2E8E4] bg-white p-3 sm:flex-row sm:items-center">
              <input
                type="text"
                placeholder="اكتب مشكلتك أو ابحث عن محام..."
                className="flex-1 bg-transparent px-3 py-2 text-sm text-[#1A201C] outline-none placeholder:text-[#5A655E]/60"
              />

              <div className="flex gap-2">
                <Link
                  href="/"
                   onClick={handleProtectedClick}
                  className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#1B3B2B] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#14301f] sm:flex-none"
                >
                  <FaRobot className="text-[#C5A059]" />
                  استشر الذكاء
                </Link>

                <Link
                  href="/"
                   onClick={handleProtectedClick}
                  className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#C5A059] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#B08C46] sm:flex-none"
                >
                  <FaUserTie />
                  ابحث عن محام
                </Link>
              </div>
            </div>

            {/* QUICK SPECIALTIES */}
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#5A655E]">
              <span className="font-bold text-[#1A201C]">تخصصات سريعة:</span>
              <Link href="/" className="underline hover:text-[#C5A059]">
                قضايا عمل
              </Link>
              <span>•</span>
              <Link href="/" className="underline hover:text-[#C5A059]">
                تأسيس شركات
              </Link>
              <span>•</span>
              <Link href="/" className="underline hover:text-[#C5A059]">
                منازعات عقارية
              </Link>
            </div>
          </div>

          {/* LEFT: CARD */}
          <div className="mx-auto w-full max-w-md -rotate-2 rounded-3xl border border-[#C5A059]/30 bg-white p-6 shadow-xl">
            {/* Logo */}
            <div className="flex justify-center">
              <Image
                src={LOGO_SRC}
                alt="منيكاتو"
                width={220}
                height={220}
                priority
                className="h-52 w-52 object-contain"
              />
            </div>

            {/* Message box */}
            <div className="mt-4 rounded-2xl border border-[#E2E8E4] bg-[#FAF9F5] p-4 text-center">
              <p className="text-xs font-bold text-[#C5A059]">
                المستشار الذكي ومطابق المحامين
              </p>
              <h3 className="mt-1 text-xl font-black text-[#1B3B2B]">
                أهلاً بك! أنا منيكاتو 🥑
              </h3>
              <p className="mt-2 text-xs leading-6 text-[#5A655E]">
                 أقوم بتحليل مشكلتك بلمسة ذكية، وأوصلك بأفضل المحامين المعتمدين
                والمناسبين لقضيتك مباشر
              </p>
            </div>

            {/* Badges */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800">
                محامين معتمدين
              </span>
              <span className="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700">
                حجز استشارة فورية
              </span>
              <span className="rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-800">
                سرية تامة
              </span>
            </div>
          </div>
        </div>

        {/* TEMP DEV LINKS */}
        {/* <div className="mx-auto mt-16 flex max-w-7xl flex-wrap gap-3">
          <Link href="/admin">
            <button className="w-full min-w-37.5 rounded-lg border border-[#1B3B2B] px-6 py-3 font-semibold text-[#1B3B2B] transition hover:bg-[#1B3B2B] hover:text-white">
              admin
            </button>
          </Link>

          <Link href="/client">
            <button className="w-full min-w-37.5 rounded-lg border border-[#1B3B2B] px-6 py-3 font-semibold text-[#1B3B2B] transition hover:bg-[#1B3B2B] hover:text-white">
              client
            </button>
          </Link>

          <Link href="/lawyer">
            <button className="w-full min-w-37.5 rounded-lg border border-[#1B3B2B] px-6 py-3 font-semibold text-[#1B3B2B] transition hover:bg-[#1B3B2B] hover:text-white">
              lawyer
            </button>
          </Link>
        </div> */}
      </section>
    </main>
  );
};

export default Page;