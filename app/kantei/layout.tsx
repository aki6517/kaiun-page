import { Shippori_Mincho } from "next/font/google";

const shipporiMincho = Shippori_Mincho({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-kantei-mincho"
});

export default function KanteiLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${shipporiMincho.variable} min-w-0 overflow-x-clip bg-[#FDFBF7] text-[#4A3F3B]`}
      style={{ fontFamily: "var(--font-kantei-mincho), 'Hiragino Mincho ProN', 'Yu Mincho', serif" }}
    >
      {children}
    </div>
  );
}
