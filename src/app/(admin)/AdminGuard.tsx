// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function AdminGuard({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const [checking, setChecking] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       router.replace("/login");
//       return;
//     }

//     setChecking(false);
//   }, [router]);

//   if (checking) {
//     return null;
//   }

//   return <>{children}</>;
// }