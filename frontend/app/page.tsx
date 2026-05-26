'use client';

import Link from 'next/link';
import { CheckCircle2, Mail, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

const benefits = [
  'Log habits in under 30 seconds',
  'See current and best streaks instantly',
  'Get weekly email summaries every Monday'
];

const features = [
  { icon: CheckCircle2, title: 'Fast daily check-ins', copy: 'One focused dashboard for marking today done without opening a spreadsheet.' },
  { icon: TrendingUp, title: 'Streak visibility', copy: 'Current streaks, longest streaks, and weekly completion rate show what is working.' },
  { icon: Mail, title: 'Weekly summaries', copy: 'A concise email recap keeps busy professionals accountable before Monday starts.' }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-50">
      <Navbar />
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-14 lg:grid-cols-[1fr_0.9fr] lg:py-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm">
            <Sparkles className="h-4 w-4" /> Built for busy professionals
          </div>
          <h1 className="max-w-4xl text-5xl font-black tracking-tight text-ink sm:text-6xl lg:text-7xl">
            Build habits that survive packed calendars.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            HabitPulse helps you log daily habits, protect streaks, and receive weekly email summaries that turn tiny wins into visible momentum.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/sign-up" className="rounded-full bg-emerald-500 px-6 py-3 text-center font-semibold text-white shadow-soft hover:bg-emerald-600">
              Start tracking free
            </Link>
            <Link href="/dashboard" className="rounded-full border border-slate-300 bg-white px-6 py-3 text-center font-semibold text-slate-800 hover:border-emerald-400">
              View dashboard
            </Link>
          </div>
          <ul className="mt-8 grid gap-3 text-sm font-medium text-slate-700 sm:grid-cols-3">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" /> {benefit}
              </li>
            ))}
          </ul>
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="gradient-card rounded-[2rem] border border-emerald-100 p-6 shadow-soft">
          <div className="rounded-[1.5rem] bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Today</p>
                <h2 className="text-2xl font-bold text-ink">3 habits due</h2>
              </div>
              <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">82% week</div>
            </div>
            <div className="mt-6 space-y-3">
              {['Morning run', 'Deep work block', 'Read 10 pages'].map((habit, index) => (
                <div key={habit} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">
                  <div>
                    <p className="font-semibold text-slate-900">{habit}</p>
                    <p className="text-sm text-slate-500">{[12, 7, 21][index]} day streak</p>
                  </div>
                  <div className="rounded-full bg-emerald-500 px-3 py-1 text-sm font-semibold text-white">Done</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-5 md:grid-cols-3">
          {features.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <Icon className="h-8 w-8 text-emerald-500" />
              <h3 className="mt-5 text-xl font-bold text-ink">{title}</h3>
              <p className="mt-3 text-slate-600">{copy}</p>
            </div>
          ))}
        </div>
        <div id="pricing" className="mt-10 rounded-3xl bg-ink p-8 text-white md:flex md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">Simple pricing</p>
            <h2 className="mt-2 text-3xl font-black">$9/month after beta</h2>
            <p className="mt-2 max-w-xl text-slate-300">Start free while we onboard first users. Upgrade when weekly summaries and advanced insights launch.</p>
          </div>
          <Link href="/sign-up" className="mt-6 inline-block rounded-full bg-white px-6 py-3 font-semibold text-ink md:mt-0">Join beta</Link>
        </div>
      </section>
    </main>
  );
}
