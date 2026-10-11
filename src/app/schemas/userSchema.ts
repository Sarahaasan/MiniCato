// import { z } from "zod";

// const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
// const ACCEPTED_IMAGE_TYPES = ["image/jpeg"];

// const fileSchema = (required: boolean, label: string) => {
//   const base = z
//     .instanceof(File, { message: `${label} is required` })
//     .refine((file) => file.size <= MAX_FILE_SIZE, {
//       message: `${label} must be 2MB or smaller`,
//     })
//     .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
//       message: `${label} must be a JPEG image`,
//     });
//   return required ? base : base.optional();
// };

// export const baseUserSchema = z.object({
//   firstName: z.string().min(3, "first name must be at least 3 characters long"),
//   lastName: z.string().min(3, "last name must be at least 3 characters long"),
//   email: z.string().email("email must be a valid email address"),
//   phone: z.string().regex(/^01[0-9]{9}$/, "phone number must be a valid Egyptian phone number"),
//   password: z.string().min(8, "password must be at least 8 characters long"),
//   confirmPassword: z.string().min(8, "confirm password must be at least 8 characters long"),

//   // shared location fields 
//   governorateId: z.coerce.number().int().min(1, "governorate is required"),
//   cityId: z.coerce.number().int().min(1, "city is required"),
// });

// export const lawyerSchema = baseUserSchema
//   .extend({
//     role: z.literal("lawyer"),
//     syndicateId: z.coerce.number().int().min(1, "syndicate is required"),
//     // OLD fields : governorate1, city1, governorate2, city2, specialization, experience, registrationNumber
//     ssnPhoto: fileSchema(true, "SSN photo"),
//     syndicateCardPhoto: fileSchema(true, "Syndicate card photo"),
//     practiceCertificatesPhoto: fileSchema(true, "Practice certificate photo"),
//     // OLD fields: idCard, unionCard, practiceCertificate
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "passwords do not match",
//     path: ["confirmPassword"],
//   });

// export const clientSchema = baseUserSchema
//   .extend({
//     role: z.literal("client"),
//     avatarPhoto: fileSchema(false, "Avatar photo"),
//     frontIdPhoto: fileSchema(true, "Front ID photo"),
//     backIdPhoto: fileSchema(true, "Back ID photo"),
//     // syndicateMembershipCardPhoto: fileSchema(true, "Syndicate membership card photo"),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "passwords do not match",
//     path: ["confirmPassword"],
//   });

//   // src/app/schemas/userSchema.ts
// export const loginSchema = z.object({
//   email: z.string().email("email must be a valid email address"),
//   password: z.string().min(8, "password must be at least 8 characters long"),
// });

// export const userSchema = z.discriminatedUnion("role", [lawyerSchema, clientSchema]);


import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg"];

const fileSchema = (required: boolean, label: string) => {
  const base = z
    .instanceof(File, { message: `${label} مطلوبة` })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `يجب ألا يزيد حجم ${label} عن 2 ميجابايت`,
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: `يجب أن تكون ${label} بصيغة JPEG`,
    });
  return required ? base : base.optional();
};

export const baseUserSchema = z.object({
  firstName: z.string().min(3, "الاسم الأول يجب ألا يقل عن 3 أحرف"),
  lastName: z.string().min(3, "اسم العائلة يجب ألا يقل عن 3 أحرف"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  phone: z
    .string()
    .regex(/^01[0-9]{9}$/, "رقم الهاتف يجب أن يكون رقم هاتف مصري صالح"),
  password: z.string().min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف"),
  confirmPassword: z
    .string()
    .min(8, "تأكيد كلمة المرور يجب ألا يقل عن 8 أحرف"),

  // shared location fields
  governorateId: z.coerce.number().int().min(1, "المحافظة مطلوبة"),
  cityId: z.coerce.number().int().min(1, "المدينة مطلوبة"),
});


export const lawyerSchema = baseUserSchema
  .extend({
    role: z.literal("lawyer"),

    // رقم القيد
    syndicateId: z.coerce
      .number()
      .int()
      .min(7,  "رقم القيد مطلوب يجب ان يحتوي علي 7 رقم "),
  
  
    // سنوات الخبرة
    yearsOfExperience: z.coerce
      .number()
      .int()
      .min(0, "سنوات الخبرة يجب أن تكون 0 أو أكثر"),

    // التخصص
   specializationIds: z
  .array(z.coerce.number().int())
  .min(1, "التخصص مطلوب")
  .max(4, "يمكن اختيار 4 تخصصات كحد أقصى"),

    ssnPhoto: fileSchema(true, "صورة الرقم القومي"),

    syndicateCardPhoto: fileSchema(true, "صورة كارنيه النقابة"),

    practiceCertificatesPhoto: fileSchema(
      true,
      "صورة شهادة مزاولة المهنة",
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });



export const clientSchema = baseUserSchema
  .extend({
    role: z.literal("client"),
    avatarPhoto: fileSchema(false, "الصورة الشخصية"),
    frontIdPhoto: fileSchema(true, "صورة البطاقة (الوجه الأمامي)"),
    backIdPhoto: fileSchema(true, "صورة البطاقة (الوجه الخلفي)"),
    // syndicateMembershipCardPhoto: fileSchema(true, "صورة كارنيه عضوية النقابة"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

// src/app/schemas/userSchema.ts
export const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف"),
});

export const userSchema = z.discriminatedUnion("role", [
  lawyerSchema,
  clientSchema,
]);