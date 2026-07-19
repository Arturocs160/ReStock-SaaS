'use client';
import { Package } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 sm:gap-3 font-semibold text-lg sm:text-xl text-gray-900 shrink-0">
      <span className="grid place-items-center w-10 h-10 rounded-full text-white bg-[#00a365]">
        <Package className="w-5 h-5" />
      </span>
      <span className="font-bold tracking-tight">ReStock</span>
    </Link>
  );
}
