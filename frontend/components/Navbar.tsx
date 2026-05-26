import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { BarChart3 } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
      <Link href="/" className="flex items-center gap-2 text-lg font-bold text-ink">
        <span className="rounded-2xl bg-emerald-500 p-2 text-white">
          <BarChart3 className="h-5 w-5" />
        </span>
        HabitPulse
      </Link>
      <nav className="flex items-center gap-4 text-sm font-medium text-slate-700">
        <Link href="/#pricing" className="hidden hover:text-emerald-700 sm:inline">Pricing</Link>
        <SignedIn>
          <Link href="/dashboard" className="rounded-full bg-ink px-4 py-2 text-white hover:bg-slate-800">Dashboard</Link>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <Link href="/sign-in" className="hover:text-emerald-700">Sign in</Link>
          <Link href="/sign-up" className="rounded-full bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600">Start free</Link>
        </SignedOut>
      </nav>
    </header>
  );
}
