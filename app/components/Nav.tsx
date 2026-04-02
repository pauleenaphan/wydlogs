"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <div className="flex items-center justify-center gap-4">
      <Link href="/"> Home </Link>
      <Link href="/history"> History </Link>
      <Link href="/report"> Report </Link>
      <Link href="/settings"> Settings </Link>
    </div>
  );
}
