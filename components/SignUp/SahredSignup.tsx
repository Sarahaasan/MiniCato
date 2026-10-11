

"use client";

import styles from "./signup.module.css";
import { API_BASE_URL } from "../../src/app/lib/config";
import LocationFields from "./LocationFields";
import { useState } from "react";
import { lawyerSchema, clientSchema } from "../../src/app/schemas/userSchema";
import SuccessMessage from "../SuccessMessage";
import LawyerFields from "./LawyerFields";
import ClientFields from "./ClientFields";
import Link from "next/link";

// role ytpe (no other types )
type Role = "lawyer" | "client";


// type for filekey (contain all files ex for client and admin)
export type FileKey =
  | "ssnPhoto"
  | "syndicateCardPhoto"
  | "practiceCertificatesPhoto"
  | "avatarPhoto"
  | "frontIdPhoto"
  | "backIdPhoto"
  | "governorateId"
  | "cityId";


const SharedSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [role, setRole] = useState<Role>("lawyer");

    // contain array of strings  ex  email → ["Invalid email"]  password → ["Password too short"] so we can use errors.email
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // disabled={loading}  prevent clicking sumbut multiple times 
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // store files value could be file | null 
  const [files, setFiles] = useState<Record<FileKey, File | null>>({
    ssnPhoto: null,
    syndicateCardPhoto: null,
    practiceCertificatesPhoto: null,
    avatarPhoto: null,
    frontIdPhoto: null,
    backIdPhoto: null,
    governorateId: null,
    cityId: null,
  });

  // accept filetype and filevalue , set value to itis type while spreading on old values 
  const handleFileChange = (field: FileKey, file: File | null) => {
    setFiles((prev) => ({ ...prev, [field]: file }));
  };


  // handle submit asunc return promise 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // clear prev errors 
    setErrors({});
    // removes an old success state.
    setSuccess(false);


    // object from formdata  , sent to backend 
    const formData = new FormData(e.currentTarget);

    // This is mainly a normalized object used for Zod validation. not related to backend 
    const payload: Record<string, unknown> = {
      role,

      // playload for shared inputs 
      firstName:
        role === "lawyer"
          ? formData.get("FirstName")
          : formData.get("firstName"),

      lastName:
        role === "lawyer"
          ? formData.get("LastName")
          : formData.get("lastName"),

      email:
        role === "lawyer"
          ? formData.get("Email")
          : formData.get("email"),

      phone:
        role === "lawyer"
          ? formData.get("PhoneNo")
          : formData.get("phone"),

      password:
        role === "lawyer"
          ? formData.get("Password")
          : formData.get("password"),

      confirmPassword: formData.get("confirmPassword"),

      governorateId:
        role === "lawyer"
          ? formData.get("GovernorateId")
          : formData.get("governorateId"),

      cityId:
        role === "lawyer"
          ? formData.get("CityId")
          : formData.get("cityId"),
    };
    
    
    // playload lawyer inputs 
    if (role === "lawyer") {
      payload.syndicateId = formData.get("SyndicateId");

      payload.yearsOfExperience = formData.get("YearsOfExperience");

      // const specializationId = formData.get("SpecializationIds");

      // payload.specializationIds = specializationId
      //   ? [Number(specializationId)]
      //   : [];

      // get multiple values and map on them to convert them into num
const specializationIds = formData
  .getAll("SpecializationIds")
  .map(Number);
payload.specializationIds = specializationIds;


      payload.ssnPhoto = files.ssnPhoto;
      payload.syndicateCardPhoto = files.syndicateCardPhoto;
      payload.practiceCertificatesPhoto =
        files.practiceCertificatesPhoto;
    } else {
      payload.avatarPhoto = files.avatarPhoto || undefined;
      payload.frontIdPhoto = files.frontIdPhoto;
      payload.backIdPhoto = files.backIdPhoto;

      payload.governorateId = formData.get("governorateId");
      payload.cityId = formData.get("cityId");
    }

    const schema = role === "lawyer" ? lawyerSchema : clientSchema;



//     if (
//   role === "lawyer" &&
//   String(payload.yearsOfExperience ?? "").trim() === ""
// ) {
//   setErrors({
//     yearsOfExperience: ["سنوات الخبرة مطلوبة"],
//   });
//   return;
// }

  // It doesn't throw an exception if validation fails. return true / false 
    const result = schema.safeParse(payload);


    // if validation failed with zod set error then return to stop anything and donot send data to backend 
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }
     
    // else validation is correct start loading now buttons are disabled and change style 
    setLoading(true);

    try {
      if (role === "lawyer") {
        // no need to send them to backend 
        formData.delete("role");
        formData.delete("confirmPassword");


        // This takes the file stored in React state and puts it into the actual FormData
        if (files.ssnPhoto) {
          formData.set("SSNPhoto", files.ssnPhoto);
        }

        if (files.syndicateCardPhoto) {
          formData.set(
            "SyndicateCardPhoto",
            files.syndicateCardPhoto,
          );
        }

        if (files.practiceCertificatesPhoto) {
          formData.set(
            "PracticeCertificatesPhoto",
            files.practiceCertificatesPhoto,
          );
        }

        formData.delete("SpecializationIds");

        const specializationIds =
          payload.specializationIds as number[];

        specializationIds.forEach((id) => {
          // multiple values with the same key.
          formData.append("SpecializationIds", id.toString());
        });
  

        // fetching 
        const res = await fetch(
          `${API_BASE_URL}/auth/register/lawyer`,
          {
            method: "POST",
            body: formData,
          },
        );

        console.log("Response status:", res.status);

        const data = await res.json();

        console.log("Response data:", data);

        // if (!res.ok) {
        //   if (
        //     res.status === 409 &&
        //     data.error?.code === "User.Conflict"
        //   ) {
        //     setErrors({
        //       email: [data.error.message],
        //     });
        //   } else {
        //     setErrors({
        //       form: [
        //         data.error?.message ?? "Something went wrong",
        //       ],
        //     });
        //   }

        //   return;
        // }
        if (!res.ok) {
  if (res.status === 409) {
    setErrors({
      email: [
        // nullish coalescing operator: check if value is null/undefined go to the next 
        data.error?.message ??
          data.messageAr ??
          data.message ??
          "هذا الحساب مسجل من قبل",
      ],
    });
  } else {
    setErrors({
      form: [
        data.error?.message ??
          data.messageAr ??
          data.message ??
          "Something went wrong",
      ],
    });
  }

  return;
}

        setSuccess(true);
      } else {
        formData.delete("role");


        // client time 
        if (files.avatarPhoto) {
          formData.set("avatarPhoto", files.avatarPhoto);
        }

        if (files.frontIdPhoto) {
          formData.set("frontIdPhoto", files.frontIdPhoto);
        }

        if (files.backIdPhoto) {
          formData.set("backIdPhoto", files.backIdPhoto);
        }

        if (files.governorateId) {
          formData.set(
            "governorateId",
            files.governorateId as unknown as string,
          );
        }

        if (files.cityId) {
          formData.set(
            "cityId",
            files.cityId as unknown as string,
          );
        }


        // fetchinh client 
        const res = await fetch(
          `${API_BASE_URL}/auth/register/client`,
          {
            method: "POST",
            body: formData,
          },
        );

        console.log("Response status:", res.status);

        const data = await res.json();

        console.log("Response data:", data);

        // if (!res.ok) {
        //   if (
        //     res.status === 409 &&
        //     data.error?.code === "User.Conflict"
        //   ) {
        //     setErrors({
        //       email: [data.error.message],
        //     });
        //   } else {
        //     setErrors({
        //       form: [
        //         data.error?.message ?? "Something went wrong",
        //       ],
        //     });
        //   }

        //   return;
        // }
        if (!res.ok) {
  if (res.status === 409) {
    setErrors({
      email: [
        data.error?.message ??
          data.messageAr ??
          data.message ??
          "هذا البريد الإلكتروني مسجل بالفعل",
      ],
    });
  } else {
    setErrors({
      form: [
        data.error?.message ??
          data.messageAr ??
          data.message ??
          "Something went wrong",
      ],
    });
  }

  return;
}

        setSuccess(true);
      }

      // reset files after succ reg 
      setFiles({
        ssnPhoto: null,
        syndicateCardPhoto: null,
        practiceCertificatesPhoto: null,
        avatarPhoto: null,
        frontIdPhoto: null,
        backIdPhoto: null,
        governorateId: null,
        cityId: null,
      });
 
      //  reset html form 
      (e.target as HTMLFormElement).reset();

      // network  errors time 
    } catch {
      setErrors({
        form: ["فشل الاتصال بالخادم"],
      });
    } finally {
      setLoading(false);
    }
  };


  // Instead of repeating a huge Tailwind string:
  const inputClass =
    "w-[90%] rounded-2xl border border-[#E2E8E4] bg-white px-4 py-3 outline-none transition focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]";

  return (
    <div
      className={`mt-11 flex min-h-screen items-center justify-center bg-[#FAF9F5] px-4 py-16 ${styles.wrapper}`}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl rounded-3xl bg-white px-8 py-12 shadow-sm md:px-10 space-y-6"
      >
        <div className="flex gap-4">
          <label
            htmlFor="lawyer"
            className={`flex-1 cursor-pointer rounded-2xl border-2 px-4 py-3 text-center text-sm font-semibold transition ${
              role === "lawyer"
                ? "border-[#C5A059] bg-[#C5A059]/10 text-[#1B3B2B]"
                : "border-[#E2E8E4] text-[#5A655E]"
            }`}
          >
            <input
              type="radio"
              name="role"
              id="lawyer"
              value="lawyer"
              checked={role === "lawyer"}
              onChange={() => setRole("lawyer")}
              className="hidden"
            />
            محامي
          </label>

          <label
            htmlFor="client"
            className={`flex-1 cursor-pointer rounded-2xl border-2 px-4 py-3 text-center text-sm font-semibold transition ${
              role === "client"
                ? "border-[#C5A059] bg-[#C5A059]/10 text-[#1B3B2B]"
                : "border-[#E2E8E4] text-[#5A655E]"
            }`}
          >
            <input
              type="radio"
              name="role"
              id="client"
              value="client"
              checked={role === "client"}
              onChange={() => setRole("client")}
              className="hidden"
            />
            عميل
          </label>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-[#1B3B2B]">
            البيانات الشخصية
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor={role === "lawyer" ? "FirstName" : "firstName"}
                className="mb-2 block text-sm font-semibold text-[#1A201C]"
              >
                الاسم الأول
              </label>

              <input
                id={role === "lawyer" ? "FirstName" : "firstName"}
                name={role === "lawyer" ? "FirstName" : "firstName"}
                type="text"
                className={inputClass}
              />

              {errors.firstName && (
                <p className="mt-1 text-[15px] text-[#DC2626]">
                  {errors.firstName[0]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={role === "lawyer" ? "LastName" : "lastName"}
                className="mb-2 block text-sm font-semibold text-[#1A201C]"
              >
                اسم العائلة
              </label>

              <input
                id={role === "lawyer" ? "LastName" : "lastName"}
                name={role === "lawyer" ? "LastName" : "lastName"}
                type="text"
                className={inputClass}
              />

              {errors.lastName && (
                <p className="mt-1 text-[15px] text-[#DC2626]">
                  {errors.lastName[0]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={role === "lawyer" ? "Email" : "email"}
                className="mb-2 block text-sm font-semibold text-[#1A201C]"
              >
                البريد الإلكتروني
              </label>

              <input
                id={role === "lawyer" ? "Email" : "email"}
                name={role === "lawyer" ? "Email" : "email"}
                type="email"
                className={inputClass}
              />

              {errors.email && (
                <p className="mt-1 text-[15px] text-[#DC2626]">
                  {errors.email[0]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={role === "lawyer" ? "PhoneNo" : "phone"}
                className="mb-2 block text-sm font-semibold text-[#1A201C]"
              >
                رقم الهاتف
              </label>

              <input
                id={role === "lawyer" ? "PhoneNo" : "phone"}
                name={role === "lawyer" ? "PhoneNo" : "phone"}
                type="tel"
                className={inputClass}
              />

              {errors.phone && (
                <p className="mt-1 text-[15px] text-[#DC2626]">
                  {errors.phone[0]}
                </p>
              )}
            </div>
          </div>
        </div>
                                         {/* pass */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-[#1A201C]"
            >
              كلمة المرور
            </label>

            <div className="relative w-[90%]">
              <input
               id={role === "lawyer" ? "Password" : "password"}
              name={role === "lawyer" ? "Password" : "password"}
                type={showPassword ? "text" : "password"}
                placeholder="أدخل كلمة المرور"
                className="w-full rounded-2xl border border-[#E2E8E4] bg-white px-4 py-3 pr-12 outline-none transition focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-[#5A655E] hover:text-[#1B3B2B]"
                aria-label={
                  showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                }
              >
                {showPassword ? (
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

            {errors.password && (
              <p className="mt-1 text-[15px] text-[#DC2626]">
                {errors.password[0]}
              </p>
            )}
          </div>
                            {/* consfirm pass  */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-semibold text-[#1A201C]"
            >
              تأكيد كلمة المرور
            </label>

            <div className="relative w-[90%]">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="أعد إدخال كلمة المرور"
                className="w-full rounded-2xl border border-[#E2E8E4] bg-white px-4 py-3 pr-12 outline-none transition focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-[#5A655E] hover:text-[#1B3B2B]"
                aria-label={
                  showConfirmPassword
                    ? "إخفاء كلمة المرور"
                    : "إظهار كلمة المرور"
                }
              >
                {showConfirmPassword ? (
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

            {errors.confirmPassword && (
              <p className="mt-1 text-[15px] text-[#DC2626]">
                {errors.confirmPassword[0]}
              </p>
            )}
          </div>
        </div>
                  {/* locationd  */}
       <LocationFields errors={errors} role={role} />

        {role === "lawyer" ? (
          <LawyerFields
            errors={errors}
            files={files}
            onFileChange={handleFileChange}
          />
        ) : (
          <ClientFields
            errors={errors}
            files={files}
            onFileChange={handleFileChange}
          />
        )}

        {errors.form && (
          <p className="text-center text-[15px] text-[#DC2626]">
            {errors.form[0]}
          </p>
        )}

        {success && (
          <SuccessMessage
            title="تم إنشاء الحساب"
            message="تم إنشاء حسابك بنجاح. سنقوم بإبلاغك بمجرد الموافقة على حسابك."
            onClose={() => setSuccess(false)}
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[#1B3B2B] px-6 py-3 font-semibold text-white transition hover:bg-[#143022] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "جارٍ التحميل..." : "إنشاء الحساب"}
        </button>

        <p className="text-center text-sm text-[#5A655E]">
          لديك حساب بالفعل؟{" "}
          <Link
            href="/login"
            className="font-semibold text-[#1B3B2B]"
          >
            تسجيل الدخول
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SharedSignup;













// "use client";
// import styles from "./signup.module.css";
// import { API_BASE_URL } from "../../src/app/lib/config";
// import LocationFields from "./LocationFields";
// import { useState } from "react";
// import { lawyerSchema, clientSchema } from "../../src/app/schemas/userSchema";
// import SuccessMessage from "../SuccessMessage";
// import LawyerFields from "./LawyerFields";
// import ClientFields from "./ClientFields";
// import Link from "next/link";
// type Role = "lawyer" | "client";

// export type FileKey =
//   | "ssnPhoto"
//   | "syndicateCardPhoto"
//   | "practiceCertificatesPhoto"
//   | "avatarPhoto"
//   | "frontIdPhoto"
//   | "backIdPhoto"
//   | "governorateId"
//   | "cityId";

// // syndicateMembershipCardPhoto

// const SharedSignup = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [role, setRole] = useState<Role>("lawyer");
//   const [errors, setErrors] = useState<Record<string, string[]>>({});
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [files, setFiles] = useState<Record<FileKey, File | null>>({
//     ssnPhoto: null,
//     syndicateCardPhoto: null,
//     practiceCertificatesPhoto: null,
//     avatarPhoto: null,
//     frontIdPhoto: null,
//     backIdPhoto: null,
//     governorateId: null,
//     cityId: null,
//     // syndicateMembershipCardPhoto: null,
//   });

//   const handleFileChange = (field: FileKey, file: File | null) => {
//     setFiles((prev) => ({ ...prev, [field]: file }));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setErrors({});
//     setSuccess(false);

//     const formData = new FormData(e.currentTarget);

//     const payload: Record<string, unknown> = {
//       role,
//       firstName: formData.get("firstName"),
//       lastName: formData.get("lastName"),
//       email: formData.get("email"),
//       phone: formData.get("phone"),
//       password: formData.get("password"),
//       confirmPassword: formData.get("confirmPassword"),
//       governorateId: formData.get("governorateId"),
//       cityId: formData.get("cityId"),
//     };

//     if (role === "lawyer") {
//       payload.governorate1 = formData.get("governorate1");
//       payload.city1 = formData.get("city1");
//       payload.governorate2 = formData.get("governorate2") || undefined;
//       payload.city2 = formData.get("city2") || undefined;
//       payload.specialization = formData.get("specialization");
//       payload.experience = formData.get("experience");
//       payload.registrationNumber = formData.get("registrationNumber");
//       payload.ssnPhoto = files.ssnPhoto;
//       payload.syndicateCardPhoto = files.syndicateCardPhoto;
//       payload.practiceCertificatesPhoto = files.practiceCertificatesPhoto;
//     } else {
//       payload.avatarPhoto = files.avatarPhoto || undefined;
//       payload.frontIdPhoto = files.frontIdPhoto;
//       payload.backIdPhoto = files.backIdPhoto;
//       payload.governorateId = formData.get("governorateId");
//       payload.cityId = formData.get("cityId");
//       // payload.syndicateMembershipCardPhoto = files.syndicateMembershipCardPhoto;
//     }

//     const schema = role === "lawyer" ? lawyerSchema : clientSchema;
//     const result = schema.safeParse(payload);

//     if (!result.success) {
//       setErrors(result.error.flatten().fieldErrors);
//       return;
//     }

//     setLoading(true);

//     try {
//       //   formData.set("role", role);
//       formData.delete("role");

//       if (role === "lawyer") {
//         if (files.ssnPhoto) formData.set("ssnPhoto", files.ssnPhoto);
//         if (files.syndicateCardPhoto)
//           formData.set("syndicateCardPhoto", files.syndicateCardPhoto);
//         if (files.practiceCertificatesPhoto)
//           formData.set(
//             "practiceCertificatesPhoto",
//             files.practiceCertificatesPhoto,
//           );
//       } else {
//         if (files.avatarPhoto) formData.set("avatarPhoto", files.avatarPhoto);
//         if (files.frontIdPhoto)
//           formData.set("frontIdPhoto", files.frontIdPhoto);
//         if (files.backIdPhoto) formData.set("backIdPhoto", files.backIdPhoto);
//         if (files.governorateId)
//           formData.set("governorateId", files.governorateId);
//         if (files.cityId) formData.set("cityId", files.cityId);
//         // if (files.syndicateMembershipCardPhoto) {
//         //   formData.set("syndicateMembershipCardPhoto", files.syndicateMembershipCardPhoto);
//         // }
//       }

//       const endpoint =
//         role === "lawyer" ? "/auth/register/lawyer" : "/auth/register/client";
//       const res = await fetch(`${API_BASE_URL}${endpoint}`, {
//         method: "POST",
//         body: formData,
//       });
//       console.log("Response status:", res.status);
//       console.log("Response status:", res);
//       const data = await res.json();
//       console.log("Response data:", data);
//       // if (!res.ok) {
//       //   setErrors(
//       //     data.errors ?? { form: [data.message ?? "Something went wrong"] },
//       //   );
//       //   return;
//       // }
//       if (!res.ok) {
//   if (res.status === 409 && data.error?.code === "User.Conflict") {
//     setErrors({
//       email: [data.error.message],
//     });
//   } else {
//     setErrors({
//       form: [data.error?.message ?? "Something went wrong"],
//     });
//   }

//   return;
// }

//       setSuccess(true);
//       setFiles({
//         ssnPhoto: null,
//         syndicateCardPhoto: null,
//         practiceCertificatesPhoto: null,
//         avatarPhoto: null,
//         frontIdPhoto: null,
//         backIdPhoto: null,
//         governorateId: null,
//         cityId: null,
//         // syndicateMembershipCardPhoto: null,
//       });
//       (e.target as HTMLFormElement).reset();
//     } catch {
//       setErrors({ form: ["Failed to connect to server"] });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const inputClass =
//     "w-[90%] rounded-2xl border border-[#E2E8E4] bg-white px-4 py-3 outline-none transition focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]";

//   return (
//     <div
//       className={`flex min-h-screen items-center justify-center bg-[#FAF9F5] px-4 py-16 ${styles.wrapper}`}
//     >
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-5xl rounded-3xl bg-white px-8 py-12 shadow-sm md:px-10 space-y-6"
//       >
//         <h1 className="text-3xl font-bold text-[#1B3B2B] md:text-4xl text-center">
//           Create an Account
//         </h1>

//         {/* ================= ROLE ================= */}
//         <div className="flex gap-4">
//           <label
//             htmlFor="lawyer"
//             className={`flex-1 cursor-pointer rounded-2xl border-2 px-4 py-3 text-center text-sm font-semibold transition ${
//               role === "lawyer"
//                 ? "border-[#C5A059] bg-[#C5A059]/10 text-[#1B3B2B]"
//                 : "border-[#E2E8E4] text-[#5A655E]"
//             }`}
//           >
//             <input
//               type="radio"
//               name="role"
//               id="lawyer"
//               value="lawyer"
//               checked={role === "lawyer"}
//               onChange={() => setRole("lawyer")}
//               className="hidden"
//             />
//             Lawyer
//           </label>

//           <label
//             htmlFor="client"
//             className={`flex-1 cursor-pointer rounded-2xl border-2 px-4 py-3 text-center text-sm font-semibold transition ${
//               role === "client"
//                 ? "border-[#C5A059] bg-[#C5A059]/10 text-[#1B3B2B]"
//                 : "border-[#E2E8E4] text-[#5A655E]"
//             }`}
//           >
//             <input
//               type="radio"
//               name="role"
//               id="client"
//               value="client"
//               checked={role === "client"}
//               onChange={() => setRole("client")}
//               className="hidden"
//             />
//             Client
//           </label>
//         </div>

//         {/* ================= BASE FIELDS ================= */}
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//           <div>
//             <label
//               htmlFor="firstName"
//               className="mb-2 block text-sm font-semibold text-[#1A201C]"
//             >
//               First Name
//             </label>
//             <input
//               id="firstName"
//               name="firstName"
//               type="text"
//               placeholder="Enter first name"
//               className={inputClass}
//             />
//             {errors.firstName && (
//               <p className="mt-1 text-[15px] text-[#DC2626]">
//                 {errors.firstName[0]}
//               </p>
//             )}
//           </div>

//           <div>
//             <label
//               htmlFor="lastName"
//               className="mb-2 block text-sm font-semibold text-[#1A201C]"
//             >
//               Last Name
//             </label>
//             <input
//               id="lastName"
//               name="lastName"
//               type="text"
//               placeholder="Enter last name"
//               className={inputClass}
//             />
//             {errors.lastName && (
//               <p className="mt-1 text-[15px] text-[#DC2626]">
//                 {errors.lastName[0]}
//               </p>
//             )}
//           </div>
//         </div>

//         <div>
//           <label
//             htmlFor="email"
//             className="mb-2 block text-sm font-semibold text-[#1A201C]"
//           >
//             Email
//           </label>
//           <input
//             id="email"
//             name="email"
//             type="email"
//             placeholder="Enter email"
//             className={inputClass}
//           />
//           {errors.email && (
//             <p className="mt-1 text-[15px] text-[#DC2626]">{errors.email[0]}</p>
//           )}
//         </div>

//         <div>
//           <label
//             htmlFor="phone"
//             className="mb-2 block text-sm font-semibold text-[#1A201C]"
//           >
//             Phone
//           </label>
//           <input
//             id="phone"
//             name="phone"
//             type="text"
//             placeholder="Enter phone"
//             className={inputClass}
//           />
//           {errors.phone && (
//             <p className="mt-1 text-[15px] text-[#DC2626]">{errors.phone[0]}</p>
//           )}
//         </div>
//         {/* goven city */}
//         <LocationFields errors={errors} />
           
//            {/* pass */}
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//           <div>
//             <label
//               htmlFor="password"
//               className="mb-2 block text-sm font-semibold text-[#1A201C]"
//             >
//               Password
//             </label>
//             <div className="relative w-[90%]">
//               <input
//                 id="password"
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter password"
//                 className="w-full rounded-2xl border border-[#E2E8E4] bg-white px-4 py-3 pr-12 outline-none transition focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword((prev) => !prev)}
//                 className="absolute inset-y-0 right-3 flex items-center text-[#5A655E] hover:text-[#1B3B2B]"
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//               >
//                 {showPassword ? (
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     strokeWidth={2}
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88"
//                     />
//                   </svg>
//                 ) : (
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     strokeWidth={2}
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
//                     />
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                     />
//                   </svg>
//                 )}
//               </button>
//             </div>
//             {errors.password && (
//               <p className="mt-1 text-[15px] text-[#DC2626]">
//                 {errors.password[0]}
//               </p>
//             )}
//           </div>

//           <div>
//             <label
//               htmlFor="confirmPassword"
//               className="mb-2 block text-sm font-semibold text-[#1A201C]"
//             >
//               Confirm Password
//             </label>
//             <div className="relative w-[90%]">
//               <input
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 type={showConfirmPassword ? "text" : "password"}
//                 placeholder="Re-enter password"
//                 className="w-full rounded-2xl border border-[#E2E8E4] bg-white px-4 py-3 pr-12 outline-none transition focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword((prev) => !prev)}
//                 className="absolute inset-y-0 right-3 flex items-center text-[#5A655E] hover:text-[#1B3B2B]"
//                 aria-label={
//                   showConfirmPassword ? "Hide password" : "Show password"
//                 }
//               >
//                 {showConfirmPassword ? (
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     strokeWidth={2}
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88"
//                     />
//                   </svg>
//                 ) : (
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     strokeWidth={2}
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
//                     />
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                     />
//                   </svg>
//                 )}
//               </button>
//             </div>
//             {errors.confirmPassword && (
//               <p className="mt-1 text-[15px] text-[#DC2626]">
//                 {errors.confirmPassword[0]}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* ================= ROLE-SPECIFIC FIELDS ================= */}
//         {role === "lawyer" ? (
//           <LawyerFields
//             errors={errors}
//             files={files}
//             onFileChange={handleFileChange}
//           />
//         ) : (
//           <ClientFields
//             errors={errors}
//             files={files}
//             onFileChange={handleFileChange}
//           />
//         )}

//         {errors.form && (
//           <p className="text-[15px] text-[#DC2626]">{errors.form[0]}</p>
//         )}

//         {success && (
//           <SuccessMessage
//             title="Account Created"
//             message="Your account has been created successfully. We will inform you once your account is approved."
//             onClose={() => setSuccess(false)}
//           />
//         )}

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full rounded-2xl bg-[#C5A059] px-6 py-3 font-semibold text-white transition hover:bg-[#B08C46] disabled:cursor-not-allowed disabled:opacity-60"
//         >
//           {loading ? "Submitting..." : "Submit"}
//         </button>

//         <p className="text-center text-sm text-[#5A655E]">
//           Already have an account?{" "}
//           <Link
//             href="/login"
//             className="font-semibold text-[#C5A059] hover:underline"
//           >
//             Log In
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default SharedSignup;
