interface ProductGridProps {
  children: React.ReactNode;
}

export default function ProductGrid({ children }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  );
}
