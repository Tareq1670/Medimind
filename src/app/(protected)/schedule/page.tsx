"use client";

import { useSchedule, useUpdateSchedule } from "@/hooks/useSchedule";
import { useState } from "react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export default function SchedulePage() {
  const { data: schedule, isLoading } = useSchedule();
  const updateSchedule = useUpdateSchedule();

  const [localSlots, setLocalSlots] = useState<Record<string, Record<string, boolean>>>({});

  const toggleSlot = (day: string, time: string) => {
    setLocalSlots((prev) => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        [time]: !(prev[day]?.[time] ?? false),
      },
    }));
  };

  const handleSave = () => {
    const slots = [];
    for (const day of days) {
      for (const time of timeSlots) {
        if (localSlots[day]?.[time]) {
          slots.push({ day, startTime: time, endTime: `${+time.split(":")[0] + 1}:00`, isAvailable: true });
        }
      }
    }
    updateSchedule.mutate(slots);
  };

  const isSlotSelected = (day: string, time: string) => {
    if (localSlots[day]?.[time] !== undefined) return localSlots[day][time];
    const existing = schedule?.find((s) => s.day === day && s.startTime === time);
    return existing?.isAvailable ?? false;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Schedule</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your weekly availability</p>
        </div>
        <button
          onClick={handleSave}
          disabled={updateSchedule.isPending}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {updateSchedule.isPending ? "Saving..." : "Save Schedule"}
        </button>
      </div>

      {isLoading ? (
        <div className="card-standard p-6 animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="flex-1 h-10 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="card-standard overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-medium text-slate-500 w-28">Day</th>
                  {timeSlots.map((t) => (
                    <th key={t} className="py-3 px-2 text-center font-medium text-slate-500 text-xs">
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map((day) => (
                  <tr key={day} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="py-3 px-4 text-sm font-medium text-slate-700 dark:text-slate-300">{day}</td>
                    {timeSlots.map((time) => (
                      <td key={time} className="py-3 px-2 text-center">
                        <button
                          onClick={() => toggleSlot(day, time)}
                          className={`w-full h-8 rounded-lg text-xs font-medium transition-colors ${
                            isSlotSelected(day, time)
                              ? "bg-primary text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                          }`}
                        >
                          {isSlotSelected(day, time) ? "✓" : ""}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card-standard p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Legend</h3>
        <div className="flex items-center gap-6 text-sm text-slate-500">
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-primary" /> Available
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-slate-100 dark:bg-slate-800" /> Unavailable
          </span>
        </div>
      </div>
    </div>
  );
}
