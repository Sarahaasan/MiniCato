type SuccessMessageProps<T = Record<string, unknown>> = {
  title?: string;
  message: string;
  data?: T;
  onClose?: () => void;
};

const SuccessMessage = <T,>({
  title = "Success",
  message,
  data,
  onClose,
}: SuccessMessageProps<T>) => {
  return (
    <div className="rounded-2xl border border-[#C5A059]/30 bg-[#C5A059]/10 p-6 mt-3.5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#1B3B2B]">{title}</h3>
          <p className="mt-1 text-sm text-[#5A655E]">{message}</p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-[#5A655E] transition hover:text-[#1B3B2B]"
          >
            ✕
          </button>
        )}
      </div>

      {data !== undefined && (
        <pre className="mt-4 max-h-60 overflow-auto rounded-xl bg-white p-4 text-xs text-[#1A201C]">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default SuccessMessage;