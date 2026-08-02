export function MetricsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="
            bg-white
            border
            border-gray-200
            rounded-3xl
            shadow-sm
            px-8
            py-6
            animate-pulse
          "
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-3 w-32 rounded bg-gray-200"></div>

              <div className="mt-5 h-10 w-40 rounded bg-gray-200"></div>

              <div className="mt-4 h-3 w-48 rounded bg-gray-200"></div>
            </div>

            <div className="h-14 w-14 rounded-2xl bg-gray-200"></div>
          </div>
        </div>
      ))}
    </div>
  );
}