
"use client";

import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_BASE_URL } from "../src/app/lib/config";
import { loginSchema } from "../src/app/schemas/userSchema";
import toast from "react-hot-toast";
import SuccessMessage from"./SuccessMessage"

const Login = () => {
  // const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPendingMessage, setShowPendingMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const payload = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const result = loginSchema.safeParse(payload);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    setLoading(true);
      let success = false
try {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result.data),
  });

  console.log(res);

  const data = await res.json();

  console.log(data);

  if (!res.ok) {
  console.log("Arabic message:", data.messageAr);

  setErrors({
    form: [data.messageAr],
  });

  return;
}

  const user = data.value.user;

  if (user.role === "Lawyer" && user.accountStatus === "PendingReview") {
    setShowPendingMessage(true);
    return;
  }

  success = true;

  toast.success("تم تسجيل الدخول بنجاح");

  localStorage.setItem("token", data.value.tokens.accessToken);
  
  // window.location.reload();
  // if (data.value.user.role === "Client") {
  //   router.push("/client");
  // } else {
  //   router.push("/lawyer");
  // }
  setTimeout(() => {
    window.location.href = "/";
  }, 1000);
} catch {
  setErrors({ form: ["فشل الاتصال بالخادم"] });
} finally {
  if (!success) setLoading(false);
}
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF9F5] px-4 py-16 mt-3.5">
      <div className="w-full max-w-md rounded-3xl bg-white px-8 py-12 shadow-sm md:px-10">

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-[#1B3B2B] md:text-4xl">
            تسجيل الدخول
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#1A201C]">
              البريد الإلكتروني
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="example@email.com"
              className="w-full rounded-2xl border border-[#E2E8E4] bg-white px-4 py-3 outline-none transition focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
            />
            {errors.email && <p className="mt-1 text-[15px] text-[#DC2626]">{errors.email[0]}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#1A201C]">
              كلمة المرور
            </label>
            <div className="relative">
  <input
    id="password"
    name="password"
    type={showPassword ? "text" : "password"}
    autoComplete="current-password"
    placeholder="أدخل كلمة المرور"
    className="w-full rounded-2xl border border-[#E2E8E4] bg-white px-4 py-3 pr-12 outline-none transition focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
  />

  <button
    type="button"
    onClick={() => setShowPassword((prev) => !prev)}
    className="absolute inset-y-0 right-3 flex items-center text-[#5A655E] hover:text-[#1B3B2B]"
    aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
  >
    {showPassword ? (
      // Eye slash - password is visible
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88"
        />
      </svg>
    ) : (
      // Eye - password is hidden
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    )}
  </button>
</div>
            {errors.password && <p className="mt-1 text-[15px] text-[#DC2626]">{errors.password[0]}</p>}
          </div>

          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm font-semibold text-[#C5A059] hover:underline">
              هل نسيت كلمة المرور؟
            </Link>
          </div>

          {errors.form && <p className="text-[15px] text-[#DC2626]">{errors.form[0]}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#C5A059] px-6 py-3 font-semibold text-white transition hover:bg-[#B08C46] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        {showPendingMessage && (
  <SuccessMessage
    title="تم استلام طلبك"
    message="عزيزنا العميل، حسابك قيد التقييم."
    onClose={() => setShowPendingMessage(false)}
  />
)}

        <p className="mt-8 text-center text-sm text-[#5A655E]">
          ليس لديك حساب؟{" "}
          <Link href="/signup" className="font-semibold text-[#C5A059] hover:underline">
            إنشاء حساب جديد
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
