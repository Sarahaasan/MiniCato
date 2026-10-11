
"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../src/app/lib/config";

type LookupItem = {
  id: number;
  name: string;
};

type LocationFieldsProps = {
  errors: Record<string, string[]>;
  role: "lawyer" | "client";
};

const inputClass =
  "w-[90%] rounded-2xl border border-[#E2E8E4] bg-white px-4 py-3 outline-none transition focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]";

const LocationFields = ({ errors, role }: LocationFieldsProps) => {
  const [governorates, setGovernorates] = useState<LookupItem[]>([]);
  const [cities, setCities] = useState<LookupItem[]>([]);
  const [selectedGovernorateId, setSelectedGovernorateId] =
    useState<string>("");
  const [loadingGovernorates, setLoadingGovernorates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    const fetchGovernorates = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/lookups/governorates`);
        const data = await res.json();
      console.log(res)
      console.log(data)
        if (data.success) {
          setGovernorates(data.value);
        }
      } catch {
      } finally {
        setLoadingGovernorates(false);
      }
    };

    fetchGovernorates();
  }, []);

  useEffect(() => {
    if (!selectedGovernorateId) return;

    const fetchCities = async () => {
      setLoadingCities(true);

      try {
        const res = await fetch(
          `${API_BASE_URL}/lookups/cities?governorateId=${selectedGovernorateId}`,
        );
        console.log(res)
        const data = await res.json();
        console.log(data)

        if (data.success) {
          setCities(data.value);
        }
      } catch {
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [selectedGovernorateId]);

  return (
    <div className="grid grid-cols-1 items-center justify-center gap-6 md:grid-cols-1">
      <div>
        <h3 className="mb-4 text-lg font-semibold text-[#1B3B2B]">
          بيانات الموقع
        </h3>

        <label
          htmlFor="governorateId"
          className="mb-2 block text-sm font-semibold text-[#1A201C]"
        >
          المحافظة
        </label>

        <select
          id="governorateId"
          name={role === "lawyer" ? "GovernorateId" : "governorateId"}
          className={inputClass}
          defaultValue=""
          disabled={loadingGovernorates}
          onChange={(e) => setSelectedGovernorateId(e.target.value)}
        >
          <option value="" disabled>
            {loadingGovernorates ? "جارٍ التحميل..." : "اختر المحافظة"}
          </option>

          {governorates.map((gov) => (
            <option key={gov.id} value={gov.id}>
              {gov.name}
            </option>
          ))}
        </select>

        {errors.governorateId && (
          <p className="mt-1 text-[15px] text-[#DC2626]">
            {errors.governorateId[0]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="cityId"
          className="mb-2 block text-sm font-semibold text-[#1A201C]"
        >
          المدينة
        </label>

        <select
          id="cityId"
          name={role === "lawyer" ? "CityId" : "cityId"}
          className={inputClass}
          defaultValue=""
          disabled={!selectedGovernorateId || loadingCities}
        >
          <option value="" disabled>
            {!selectedGovernorateId
              ? "اختر المحافظة أولًا"
              : loadingCities
                ? "جارٍ التحميل..."
                : "اختر المدينة"}
          </option>

          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>

        {errors.cityId && (
          <p className="mt-1 text-[15px] text-[#DC2626]">
            {errors.cityId[0]}
          </p>
        )}
      </div>
    </div>
  );
};
export default LocationFields;