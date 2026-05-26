import { auth } from '@clerk/nextjs/server';
import { CalendarDays, CheckCircle2, Flame, Mail, Plus, TrendingUp } from 'lucide-react';

const habits = [
  { name: 'Morning workout', streak: 14, best: 22, doneToday: true, weekly: 86 },
  { name: 'Plan tomorrow', streak: 9, best: 15, doneToday: true, weekly: 71 },
  { name: 'Read 10 pages', streak: 4, best: 31, doneToday: false, weekly: 57 }
];

const activity = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function DashboardPage() {
  const { userId } = auth();
  const completed = habits.filter((habit) => habit.doneToday).length;
  const avgWeekly = Math.round(habits.reduce((sum, habit) => sum + habit.weekly, 0) / habits.length);

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 pt-6">
      <div className="rounded-[2rem] bg-ink p-8 text-white shadow-soft">
        <p className="text-sm font-medium text-emerald-300">Dashboard</p>
        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black">Keep streaks alive today.</h1>
            <p className="mt-3 max-w-2xl text-slate-300">Mark habits complete, watch streaks update, and keep weekly summary data ready for email delivery.</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-slate-200">Signed in user: {userId ? 'connected' : 'demo mode'}</div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-4">
        <Metric icon={CheckCircle2} label="Done today" value={`${completed}/${habits.length}`} />
        <Metric icon={Flame} label="Best active streak" value={`${Math.max(...habits.map((h) => h.streak))} days`} />
        <Metric icon={TrendingUp} label="Weekly completion" value={`${avgWeekly}%`} />
        <Metric icon={Mail} label="Next summary" value="Monday" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.7fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-ink">Today’s habits</h2>
              <p className="text-sm text-slate-500">Click status after connecting API data.</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600">
              <Plus className="h-4 w-4" /> New habit
            </button>
          </div>
          <div className="mt-5 space-y-4">
            {habits.map((habit) => (
              <div key={habit.name} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">{habit.name}</h3>
                    <p className="text-sm text-slate-500">Current streak {habit.streak} days · Best {habit.best} days</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${habit.doneToday ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {habit.doneToday ? 'Logged today' : 'Needs check-in'}
                  </span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${habit.weekly}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-6 w-6 text-emerald-500" />
              <h2 className="text-xl font-bold text-ink">Week at a glance</h2>
            </div>
            <div className="mt-5 grid grid-cols-7 gap-2">
              {activity.map((day, index) => (
                <div key={day} className="text-center">
                  <div className={`mx-auto mb-2 h-10 w-10 rounded-2xl ${index < 5 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                  <p className="text-xs font-medium text-slate-500">{day}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-emerald-500 p-6 text-white shadow-soft">
            <Mail className="h-7 w-7" />
            <h2 className="mt-4 text-xl font-bold">Weekly summary preview</h2>
            <p className="mt-2 text-emerald-50">“You completed 15 of 21 check-ins and kept Morning workout above 14 days.”</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof CheckCircle2; label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <Icon className="h-6 w-6 text-emerald-500" />
      <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-ink">{value}</p>
    </div>
  );
}
