"use client";

import { FileKey } from "./SahredSignup";
import SpecializationSelect from "./SpecializationSelect";
type LawyerFieldsProps = {
  errors: Record<string, string[]>;
  files: Record<FileKey, File | null>;
  onFileChange: (field: FileKey, file: File | null) => void;
};

const inputClass =
  "w-[90%] rounded-2xl border border-[#E2E8E4] bg-white px-4 py-3 outline-none transition focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]";

const documents: { key: FileKey; label: string }[] = [
  { key: "ssnPhoto", label: "صورة الرقم القومي" },
  { key: "syndicateCardPhoto", label: "صورة كارنيه النقابة" },
  { key: "practiceCertificatesPhoto", label: "صورة شهادة مزاولة المهنة" },
];

const LawyerFields = ({ errors, files, onFileChange }: LawyerFieldsProps) => {
  return (
    <>
      <div>
        <h3 className="mb-4 text-lg font-semibold text-[#1B3B2B]">
          البيانات المهنية
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
          <div>
            <label
              htmlFor="SyndicateId"
              className="mb-2 block text-sm font-semibold text-[#1A201C]"
            >
              رقم القيد
            </label>

            <input
              id="SyndicateId"
              name="SyndicateId"
              type="text"
              min={12}
              placeholder="أدخل رقم القيد"
              className={inputClass}
            />

            {errors.syndicateId && (
              <p className="mt-1 text-[15px] text-[#DC2626]">
                {errors.syndicateId[0]}
              </p>
            )}
          </div>

          <div>
            {/* <label
              htmlFor="SpecializationIds"
              className="mb-2 block text-sm font-semibold text-[#1A201C]"
            >
              التخصص
            </label>

            <select
              id="SpecializationIds"
              name="SpecializationIds"
              defaultValue="4"
              className={inputClass}
            >
              <option value="4">محامي القانون الجنائي</option>
            </select>

            

            {errors.specializationIds && (
              <p className="mt-1 text-[15px] text-[#DC2626]">
                {errors.specializationIds[0]}
              </p>
            )} */}
            <SpecializationSelect
              error={errors.specializationIds?.[0]}
              inputClass={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="YearsOfExperience"
              className="mb-2 block text-sm font-semibold text-[#1A201C]"
            >
              سنوات الخبرة
            </label>

            <input
              id="YearsOfExperience"
              name="YearsOfExperience"
              type="number"
              min={0}
              placeholder="مثال: 7"
              className={inputClass}
            />

            {errors.yearsOfExperience && (
              <p className="mt-1 text-[15px] text-[#DC2626]">
                {errors.yearsOfExperience[0]}
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-[#1B3B2B]">
          التحقق من البيانات المهنية
        </h3>

        <p className="mb-4 text-sm text-[#5A655E]">
          يرجى رفع المستندات المطلوبة. يجب أن تكون الصور بصيغة JPEG وبحجم لا
          يتجاوز 2 ميجابايت لكل صورة.
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
                  {doc.label}
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
                      className="ml-2 text-sm font-semibold text-[#DC2626] transition hover:text-red-700"
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
    </>
  );
};

export default LawyerFields;
