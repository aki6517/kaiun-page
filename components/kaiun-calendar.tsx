"use client";

import { useState } from "react";
import { KAIUN_MONTHS, KAIUN_YEAR, getDayMark, type DayMark } from "@/lib/kaiun-days-2026";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

type Badge = { label: string; cls: string };

function getBadges(m: DayMark): Badge[] {
  const b: Badge[] = [];
  if (m.tensha) b.push({ label: "天赦", cls: "bg-[#E8D9C3] text-[#2D2428] font-semibold" });
  if (m.ichiryu) b.push({ label: "一粒", cls: "bg-[#E0D2BC]/90 text-[#2D2428]" });
  if (m.taian) b.push({ label: "大安", cls: "bg-[#8B9A5B]/85 text-white" });
  if (m.tora) b.push({ label: "寅", cls: "bg-[#C79FA5]/85 text-[#2D2428]" });
  if (m.mi) b.push({ label: "巳", cls: "bg-[#C79FA5]/85 text-[#2D2428]" });
  if (m.fujoju) b.push({ label: "不成就", cls: "bg-[#5A4A52] text-[#E8DAD6]" });
  if (m.moon === "new") b.push({ label: "新月", cls: "border border-[#E8D9C3]/45 bg-[#3A3035] text-[#E8D9C3]" });
  if (m.moon === "full") b.push({ label: "満月", cls: "border border-[#E8D9C3]/55 bg-[#E8D9C3]/25 text-[#F7F1E8]" });
  return b;
}

export default function KaiunCalendar() {
  const [idx, setIdx] = useState(0);
  const month = KAIUN_MONTHS[idx];
  const firstWeekday = new Date(KAIUN_YEAR, month - 1, 1).getDay();
  const daysInMonth = new Date(KAIUN_YEAR, month, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="rounded-2xl border border-[#E8D9C3]/25 bg-[#241D21] p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
          aria-label="前の月"
          className="rounded-full px-3 py-1 text-lg text-[#E8D9C3] transition hover:bg-white/5 disabled:opacity-25"
        >
          ◀
        </button>
        <p className="text-base font-semibold text-[#F7F1E8]">
          {KAIUN_YEAR}年 {month}月
        </p>
        <button
          type="button"
          onClick={() => setIdx((i) => Math.min(KAIUN_MONTHS.length - 1, i + 1))}
          disabled={idx === KAIUN_MONTHS.length - 1}
          aria-label="次の月"
          className="rounded-full px-3 py-1 text-lg text-[#E8D9C3] transition hover:bg-white/5 disabled:opacity-25"
        >
          ▶
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className={`py-1 font-semibold ${i === 0 ? "text-[#D9A0A0]" : i === 6 ? "text-[#A0B6D9]" : "text-[#C7B0B0]"}`}
          >
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={`e-${i}`} />;
          const mark = getDayMark(month, d);
          const isSaikyo = Boolean(mark.tensha && mark.ichiryu);
          const wd = (firstWeekday + d - 1) % 7;
          return (
            <div
              key={d}
              className={`min-h-[58px] rounded-lg border p-1 ${
                isSaikyo
                  ? "border-[#E8D9C3] bg-[#E8D9C3]/10 shadow-[0_0_0_1px_rgba(232,217,195,0.55)]"
                  : "border-white/10 bg-[#2D2428]"
              }`}
            >
              <div
                className={`text-[11px] font-medium ${wd === 0 ? "text-[#D9A0A0]" : wd === 6 ? "text-[#A0B6D9]" : "text-[#EDE3D6]"}`}
              >
                {d}
              </div>
              <div className="mt-0.5 flex flex-col gap-0.5">
                {getBadges(mark).map((b, j) => (
                  <span key={j} className={`rounded px-1 text-center text-[9px] leading-[1.4] ${b.cls}`}>
                    {b.label}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[#C7B0B0]">
        <span>天赦＝天赦日</span>
        <span>一粒＝一粒万倍日</span>
        <span>大安</span>
        <span>寅・巳＝金運日</span>
        <span>不成就＝注意日</span>
        <span>満月・新月</span>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-[#9C8A8A]">
        枠が光っている日は、天赦日と一粒万倍日が重なる「最強開運日」です。
      </p>
    </div>
  );
}
