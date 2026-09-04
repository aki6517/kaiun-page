import { CornerFan, DoubleLineFrame } from "@/components/kantei/ornaments";

export function PrayerPage({ children }: Readonly<{ children: React.ReactNode }>) {
  const cornerClassName = "pointer-events-none absolute size-14 text-[#B08A4F] sm:size-16";

  return (
    <section className="relative overflow-hidden bg-[#FDFBF7] px-6 py-16 sm:px-12 sm:py-20">
      <DoubleLineFrame
        className="pointer-events-none absolute"
        style={{ inset: "0.5rem", width: "calc(100% - 1rem)", height: "calc(100% - 1rem)" }}
        color="#D9C08F"
      />
      <CornerFan corner="top-left" className={`${cornerClassName} left-3 top-3`} />
      <CornerFan corner="top-right" className={`${cornerClassName} right-3 top-3`} />
      <CornerFan corner="bottom-right" className={`${cornerClassName} bottom-3 right-3`} />
      <CornerFan corner="bottom-left" className={`${cornerClassName} bottom-3 left-3`} />
      <div className="relative mx-auto max-w-[34em]">{children}</div>
    </section>
  );
}
