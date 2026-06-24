// 2026年6〜12月の開運日データ（一粒万倍日・天赦日・大安・寅の日・巳の日・不成就日・満月・新月）。
// データは池田工芸「開運日カレンダー」を参照。ボイドタイムは正確な年間データが無いため含めない。

export type MoonPhase = "new" | "full";

export type DayMark = {
  ichiryu?: boolean; // 一粒万倍日
  tensha?: boolean; // 天赦日
  taian?: boolean; // 大安
  tora?: boolean; // 寅の日
  mi?: boolean; // 巳の日
  fujoju?: boolean; // 不成就日（凶日）
  moon?: MoonPhase; // 新月 / 満月
};

const ichiryu: Record<number, number[]> = {
  6: [12, 13, 24, 25],
  7: [6, 7, 10, 19, 22, 31],
  8: [3, 13, 18, 25, 30],
  9: [6, 7, 14, 19, 26],
  10: [1, 11, 14, 23, 26],
  11: [4, 7, 8, 19, 20],
  12: [1, 2, 15, 16, 27, 28]
};
const tensha: Record<number, number[]> = { 7: [19], 10: [1], 12: [16] };
const taian: Record<number, number[]> = {
  6: [5, 11, 15, 21, 27],
  7: [3, 9, 19, 25, 31],
  8: [6, 12, 17, 23, 29],
  9: [4, 10, 14, 20, 26],
  10: [2, 8, 13, 19, 25, 31],
  11: [6, 10, 16, 22, 28],
  12: [4, 9, 15, 21, 27]
};
const tora: Record<number, number[]> = {
  6: [9, 21],
  7: [3, 15, 27],
  8: [8, 20],
  9: [1, 13, 25],
  10: [7, 19, 31],
  11: [12, 24],
  12: [6, 18, 30]
};
const mi: Record<number, number[]> = {
  6: [12, 24],
  7: [6, 18, 30],
  8: [11, 23],
  9: [4, 16, 28],
  10: [10, 22],
  11: [3, 15, 27],
  12: [9, 21]
};
const fujoju: Record<number, number[]> = {
  6: [5, 13, 19, 27],
  7: [5, 13, 19, 27],
  8: [4, 12, 15, 23, 31],
  9: [8, 12, 20, 28],
  10: [6, 11, 19, 27],
  11: [4, 12, 20, 28],
  12: [6, 13, 21, 29]
};
const newMoon: Record<number, number> = { 6: 15, 7: 14, 8: 13, 9: 11, 10: 11, 11: 9, 12: 9 };
const fullMoon: Record<number, number> = { 6: 30, 7: 29, 8: 28, 9: 27, 10: 26, 11: 24, 12: 24 };

export const KAIUN_YEAR = 2026;
export const KAIUN_MONTHS = [6, 7, 8, 9, 10, 11, 12];

export function getDayMark(month: number, day: number): DayMark {
  const has = (m: Record<number, number[]>) => (m[month] ?? []).includes(day);
  const mark: DayMark = {};
  if (has(ichiryu)) mark.ichiryu = true;
  if (has(tensha)) mark.tensha = true;
  if (has(taian)) mark.taian = true;
  if (has(tora)) mark.tora = true;
  if (has(mi)) mark.mi = true;
  if (has(fujoju)) mark.fujoju = true;
  if (newMoon[month] === day) mark.moon = "new";
  if (fullMoon[month] === day) mark.moon = "full";
  return mark;
}
