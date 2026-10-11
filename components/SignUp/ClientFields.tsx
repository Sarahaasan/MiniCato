



"use client";

import { FileKey } from "./SahredSignup";

type ClientFieldsProps = {
  errors: Record<string, string[]>;
  files: Record<FileKey, File | null>;
  onFileChange: (field: FileKey, file: File | null) => void;
};

const documents: { key: FileKey; label: string; optional?: boolean }[] = [
  { key: "avatarPhoto", label: "الصورة الشخصية", optional: true },
  { key: "frontIdPhoto", label: "صورة الوجه الأمامي للبطاقة" },
  { key: "backIdPhoto", label: "صورة الوجه الخلفي للبطاقة" },
];

const ClientFields = ({ errors, files, onFileChange }: ClientFieldsProps) => {
  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-[#1B3B2B]">
        التحقق من الهوية
      </h3>

      <p className="mb-4 text-sm text-[#5A655E]">
        يرجى رفع المستندات المطلوبة. يجب أن تكون الصور بصيغة JPEG وبحجم لا يتجاوز 2 ميجابايت لكل صورة.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {documents.map((doc) => {
          const file = files[doc.key];

          return (
            <div key={doc.key}>
              <label
                htmlFor={doc.key}
                className="mb-2 block text-sm font-semibold text-[#1A201C]"
              >
                {doc.label}{" "}
                {doc.optional && (
                  <span className="text-sm font-normal text-[#5A655E]">
                    (اختياري)
                  </span>
                )}
              </label>

              {!file ? (
                <label
                  htmlFor={doc.key}
                  className="flex w-[90%] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#C5A059] bg-[#FAF9F5] px-4 py-8 text-center text-sm font-semibold text-[#1B3B2B] transition hover:bg-[#f5f2e9]"
                >
                  اختر ملفًا

                  <input
                    id={doc.key}
                    name={doc.key}
                    type="file"
                    accept="image/jpeg"
                    onChange={(e) =>
                      onFileChange(doc.key, e.target.files?.[0] ?? null)
                    }
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="flex w-[90%] items-center justify-between rounded-2xl border border-[#E2E8E4] bg-white px-4 py-3">
                  <span className="max-w-[140px] truncate text-sm text-[#1A201C]">
                    {file.name}
                  </span>

                  <button
                    type="button"
                    onClick={() => onFileChange(doc.key, null)}
                    className="ml-2 text-[15px] font-semibold text-[#DC2626] transition hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              )}

              {errors[doc.key] && (
                <p className="mt-1 text-[15px] text-[#DC2626]">
                  {errors[doc.key][0]}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientFields;