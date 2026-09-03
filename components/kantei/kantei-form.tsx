"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { getBirthDateBounds, kanteiFormSchema, type KanteiFormValues } from "@/lib/kantei/schema";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

type FieldErrors = Partial<Record<keyof KanteiFormValues, string>>;

const initialValues: KanteiFormValues = {
  name: "",
  birthDate: "",
  email: "",
  consent: false
};

function pushDataLayerEvent(event: string): void {
  try {
    const dataLayer = Array.isArray(window.dataLayer) ? window.dataLayer : [];
    window.dataLayer = dataLayer;
    dataLayer.push({ event });
  } catch {
    // Analytics must never interrupt the application or its successful submission flow.
  }
}

function getFieldErrors(values: KanteiFormValues): FieldErrors {
  const parsed = kanteiFormSchema.safeParse(values);
  if (parsed.success) return {};

  const errors: FieldErrors = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !(field in errors)) {
      errors[field as keyof KanteiFormValues] = issue.message;
    }
  }
  return errors;
}

export function KanteiForm() {
  const router = useRouter();
  const { min, max } = getBirthDateBounds();
  const [values, setValues] = useState<KanteiFormValues>(initialValues);
  const [website, setWebsite] = useState("");
  const [formStartedAt, setFormStartedAt] = useState<number | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const submitLockRef = useRef(false);

  useEffect(() => {
    setFormStartedAt(Date.now());
    pushDataLayerEvent("kantei_form_view");
  }, []);

  function updateValue<Key extends keyof KanteiFormValues>(key: Key, value: KanteiFormValues[Key]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLockRef.current) return;

    if (formStartedAt === null) {
      setSubmitError("フォームを準備しています。少し待ってからもう一度お試しください");
      return;
    }

    const nextErrors = getFieldErrors(values);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const firstInvalidField = Object.keys(nextErrors)[0];
      requestAnimationFrame(() => document.getElementById(firstInvalidField)?.focus());
      return;
    }

    setSubmitError("");
    submitLockRef.current = true;
    setIsSubmitting(true);
    let succeeded = false;

    try {
      const response = await fetch("/api/kantei/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website, formStartedAt })
      });
      const payload: unknown = await response.json();

      if (!response.ok || !isSuccessfulResponse(payload)) {
        setSubmitError("送信できませんでした。時間をおいてもう一度お試しください");
        return;
      }

      pushDataLayerEvent("kantei_form_submit");
      succeeded = true;
      setIsDone(true);
      router.push("/kantei/thanks");
    } catch {
      setSubmitError("送信できませんでした。時間をおいてもう一度お試しください");
    } finally {
      if (!succeeded) {
        submitLockRef.current = false;
        setIsSubmitting(false);
      }
    }
  }

  let submitButtonLabel = "無料で鑑定を申し込む";
  if (isDone) {
    submitButtonLabel = "受付しました";
  } else if (isSubmitting) {
    submitButtonLabel = "送信中です…";
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="relative space-y-5" aria-describedby={submitError ? "kantei-submit-error" : undefined}>
      <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Webサイト</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>
      <input type="hidden" name="formStartedAt" value={formStartedAt ?? ""} />

      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-[#4A3F3B]">
          お名前
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          minLength={1}
          maxLength={50}
          value={values.name}
          onChange={(event) => updateValue("name", event.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          className="w-full min-w-0 rounded-none border border-[#8A6A3B] bg-[#FDFBF7] px-4 py-3 text-base text-[#4A3F3B] outline-none transition-colors aria-[invalid=true]:border-[#B7848C] focus-visible:border-[#8A6A3B] focus-visible:ring-2 focus-visible:ring-[#B7848C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7]"
        />
        {errors.name ? <p id="name-error" aria-live="polite" className="mt-2 text-sm font-medium text-[#4A3F3B]">{errors.name}</p> : null}
      </div>

      <div>
        <label htmlFor="birthDate" className="mb-2 block text-sm font-medium text-[#4A3F3B]">
          生年月日
        </label>
        <input
          id="birthDate"
          name="birthDate"
          type="date"
          autoComplete="bday"
          required
          min={min}
          max={max}
          value={values.birthDate}
          onChange={(event) => updateValue("birthDate", event.target.value)}
          aria-invalid={Boolean(errors.birthDate)}
          aria-describedby={errors.birthDate ? "birthDate-error" : undefined}
          className="w-full min-w-0 rounded-none border border-[#8A6A3B] bg-[#FDFBF7] px-4 py-3 text-base text-[#4A3F3B] outline-none transition-colors [color-scheme:light] aria-[invalid=true]:border-[#B7848C] focus-visible:border-[#8A6A3B] focus-visible:ring-2 focus-visible:ring-[#B7848C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7]"
        />
        {errors.birthDate ? <p id="birthDate-error" aria-live="polite" className="mt-2 text-sm font-medium text-[#4A3F3B]">{errors.birthDate}</p> : null}
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#4A3F3B]">
          メールアドレス
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          spellCheck={false}
          required
          maxLength={254}
          value={values.email}
          onChange={(event) => updateValue("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="w-full min-w-0 rounded-none border border-[#8A6A3B] bg-[#FDFBF7] px-4 py-3 text-base text-[#4A3F3B] outline-none transition-colors aria-[invalid=true]:border-[#B7848C] focus-visible:border-[#8A6A3B] focus-visible:ring-2 focus-visible:ring-[#B7848C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7]"
        />
        {errors.email ? <p id="email-error" aria-live="polite" className="mt-2 text-sm font-medium text-[#4A3F3B]">{errors.email}</p> : null}
      </div>

      <div>
        <label htmlFor="consent" className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#4A3F3B]">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            checked={values.consent}
            onChange={(event) => updateValue("consent", event.target.checked)}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            className="mt-1 size-4 shrink-0 accent-[#B7848C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8A6A3B]"
          />
          <span>
            <Link href="/privacy-policy" className="font-medium text-[#8A6A3B] underline decoration-[#8A6A3B] underline-offset-4">
              個人情報の取り扱い
            </Link>
            に同意する
          </span>
        </label>
        {errors.consent ? <p id="consent-error" aria-live="polite" className="mt-2 text-sm font-medium text-[#4A3F3B]">{errors.consent}</p> : null}
      </div>

      {submitError ? <p id="kantei-submit-error" aria-live="polite" className="text-sm font-medium text-[#4A3F3B]">{submitError}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting || isDone}
        className="w-full min-h-11 touch-manipulation bg-[#B08A4F] px-6 py-4 text-base font-bold text-[#2D2428] transition-colors hover:bg-[#D9C08F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8A6A3B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7] disabled:cursor-not-allowed disabled:bg-[#D9C08F] disabled:text-[#2D2428]"
      >
        {submitButtonLabel}
      </button>
      <p className="text-center text-sm leading-7 text-[#4A3F3B]">
        鑑定書は24時間以内を目安にメールでお届けします。順次作成のため前後する場合があります。
      </p>
    </form>
  );
}

function isSuccessfulResponse(value: unknown): value is { ok: true } {
  return typeof value === "object" && value !== null && "ok" in value && value.ok === true;
}
