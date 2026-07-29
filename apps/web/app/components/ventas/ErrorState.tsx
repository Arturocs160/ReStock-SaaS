"use client";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-lg rounded-xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-red-700">Ocurrió un error</h2>

        <p className="mt-3 text-gray-700">{message}</p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-lg bg-red-600 px-5 py-2 text-white transition hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
