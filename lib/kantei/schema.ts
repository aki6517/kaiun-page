import { z } from "zod";

const MIN_BIRTH_YEAR = 1920;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function getLatestBirthDate(): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const year = Number(values.year) - 5;
  const month = Number(values.month);
  const lastDayOfMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const day = Math.min(Number(values.day), lastDayOfMonth);

  return `${year}-${values.month}-${String(day).padStart(2, "0")}`;
}

function isValidBirthDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const normalized = date.toISOString().slice(0, 10);

  return year >= MIN_BIRTH_YEAR && value === normalized && value <= getLatestBirthDate();
}

export const kanteiFormSchema = z.object({
  name: z.string().trim().min(1, "お名前を入力してください").max(50, "お名前は50文字以内で入力してください"),
  birthDate: z
    .string()
    .refine(isValidBirthDate, "生年月日は1920年から5歳以上の範囲で入力してください"),
  email: z
    .string()
    .trim()
    .email("メールアドレスの形式を確認してください")
    .max(254, "メールアドレスの形式を確認してください")
    .transform((value) => value.toLowerCase()),
  consent: z.literal(true, {
    errorMap: () => ({ message: "個人情報の取り扱いへの同意が必要です" })
  })
});

export const kanteiRequestSchema = kanteiFormSchema.extend({
  website: z.string().max(200),
  formStartedAt: z.coerce.number().int().positive()
});

export type KanteiFormValues = {
  name: string;
  birthDate: string;
  email: string;
  consent: boolean;
};

export function getBirthDateBounds(): { min: string; max: string } {
  return {
    min: `${MIN_BIRTH_YEAR}-01-01`,
    max: getLatestBirthDate()
  };
}
