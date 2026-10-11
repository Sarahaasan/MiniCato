
"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../src/app/lib/config";

type Specialization = {
  id: number;
  title: string;
  arabicTitle: string;
};

type Props = {
  error?: string;
  inputClass: string;
};

const SpecializationSelect = ({ error, inputClass }: Props) => {
  const [items, setItems] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchFailed, setFetchFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/specializations`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("Request failed");
        }

        const data = await res.json();

        setItems(data.value ?? []);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setFetchFailed(true);
        }
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => controller.abort();
  }, []);

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#1A201C]">
        التخصص
      </label>

      <div
        className={`${inputClass} max-h-52 overflow-y-auto p-2`}
        dir="rtl"
      >
        {loading ? (
          <p className="px-3 py-2 text-sm text-[#5A655E]">
            جاري التحميل...
          </p>
        ) : fetchFailed ? (
          <p className="px-3 py-2 text-sm text-[#DC2626]">
            تعذر تحميل التخصصات
          </p>
        ) : (
          <div className="space-y-1">
            {items.map((specialization) => (
              <label
                key={specialization.id}
                className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-[#F3F6F4]"
              >
                <input
                  type="checkbox"
                  name="SpecializationIds"
                  value={specialization.id}
                  className="h-4 w-4 cursor-pointer accent-[#1B3B2B]"
                />

                <span className="text-sm text-[#1A201C]">
                  {specialization.arabicTitle}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-[15px] text-[#DC2626]">
          {error}
        </p>
      )}
    </div>
  );
};

export default SpecializationSelect;


