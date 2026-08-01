import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: ReactNode;
  description: ReactNode;
  icon: ReactNode;
  valueClassName?: string;
  iconContainerClassName?: string;
  iconClassName?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  description,
  icon,
  valueClassName = "text-gray-900",
  iconContainerClassName = "bg-gray-100",
  iconClassName = "text-gray-900",
  className = "",
}: MetricCardProps) {
  return (
    <div
      className={`
        bg-white
        border
        border-gray-200
        rounded-2xl
        shadow-sm
        px-5
        py-4
        transition-all
        duration-200
        hover:shadow-md
        ${className}
      `}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {title}
          </p>

          <div className={`mt-2 ${valueClassName}`}>
            {value}
          </div>

          <p className="mt-1.5 text-xs text-gray-500 whitespace-nowrap">
            {description}
          </p>
        </div>

        <div
          className={`
            w-12
            h-12
            shrink-0
            rounded-xl
            flex
            items-center
            justify-center
            ${iconContainerClassName}
          `}
        >
          <div className={iconClassName}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}