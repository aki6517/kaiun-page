import type { SVGProps } from "react";

type OrnamentProps = Omit<SVGProps<SVGSVGElement>, "aria-hidden" | "color" | "focusable" | "viewBox"> & {
  color?: string;
};

type Corner = "top-left" | "top-right" | "bottom-right" | "bottom-left";

const cornerTransforms: Record<Corner, string | undefined> = {
  "top-left": undefined,
  "top-right": "translate(72 0) scale(-1 1)",
  "bottom-right": "rotate(180 36 36)",
  "bottom-left": "translate(0 72) scale(1 -1)"
};

export function CornerFan({ color, style, corner = "top-left", ...props }: OrnamentProps & { corner?: Corner }) {
  return (
    <svg
      {...props}
      style={{ ...style, color: color ?? style?.color }}
      viewBox="0 0 72 72"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g transform={cornerTransforms[corner]} stroke="currentColor" strokeWidth="0.9">
        <path d="M4 58A54 54 0 0 1 58 4" vectorEffect="non-scaling-stroke" />
        <path d="M4 48A44 44 0 0 1 48 4" opacity="0.58" vectorEffect="non-scaling-stroke" />
        <path d="M4 4V58" vectorEffect="non-scaling-stroke" />
        <path d="M4 4L18 56" vectorEffect="non-scaling-stroke" />
        <path d="M4 4L31 49" vectorEffect="non-scaling-stroke" />
        <path d="M4 4L43 39" vectorEffect="non-scaling-stroke" />
        <path d="M4 4L52 25" vectorEffect="non-scaling-stroke" />
        <path d="M4 4H58" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}

export function DoubleLineFrame({ color, style, ...props }: OrnamentProps) {
  return (
    <svg
      {...props}
      style={{ ...style, color: color ?? style?.color }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="currentColor">
        <rect x="1.5" y="1.5" width="97" height="97" strokeWidth="0.9" vectorEffect="non-scaling-stroke" />
        <rect x="4.5" y="4.5" width="91" height="91" strokeWidth="0.55" opacity="0.78" vectorEffect="non-scaling-stroke" />
        <path d="M10 4.5c0 3.2-2.3 5.5-5.5 5.5 3.2 0 5.5 2.3 5.5 5.5" strokeWidth="0.75" vectorEffect="non-scaling-stroke" />
        <path d="M90 4.5c0 3.2 2.3 5.5 5.5 5.5-3.2 0-5.5 2.3-5.5 5.5" strokeWidth="0.75" vectorEffect="non-scaling-stroke" />
        <path d="M10 95.5c0-3.2-2.3-5.5-5.5-5.5 3.2 0 5.5-2.3 5.5-5.5" strokeWidth="0.75" vectorEffect="non-scaling-stroke" />
        <path d="M90 95.5c0-3.2 2.3-5.5 5.5-5.5-3.2 0-5.5-2.3-5.5-5.5" strokeWidth="0.75" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}

export function SunriseEmblem({ color, style, ...props }: OrnamentProps) {
  return (
    <svg
      {...props}
      style={{ ...style, color: color ?? style?.color }}
      viewBox="0 0 180 104"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="currentColor" strokeLinecap="round">
        <path d="M63 73a27 27 0 0 1 54 0" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
        <path d="M12 73h156M26 80h128M43 87h94" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
        <path d="M90 13v35M60 22l15 30M120 22l-15 30M39 42l28 18M141 42l-28 18M27 65l33 4M153 65l-33 4" strokeWidth="0.9" vectorEffect="non-scaling-stroke" />
        <path d="M90 5v3M51 17l2 3M129 17l-2 3M24 51l4 1M156 51l-4 1" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}

export function MoonPhaseDivider({ color, style, ...props }: OrnamentProps) {
  return (
    <svg
      {...props}
      style={{ ...style, color: color ?? style?.color }}
      viewBox="0 0 260 40"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="currentColor">
        <path d="M14 20h39M71 20h21M110 20h13M137 20h13M168 20h21M207 20h39" strokeWidth="0.65" opacity="0.72" vectorEffect="non-scaling-stroke" />
        <circle cx="62" cy="20" r="5" fill="currentColor" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
        <circle cx="101" cy="20" r="6" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
        <path d="M101 14a6 6 0 0 0 0 12Z" fill="currentColor" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
        <circle cx="130" cy="20" r="6" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
        <circle cx="159" cy="20" r="6" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
        <path d="M159 14a6 6 0 0 1 0 12Z" fill="currentColor" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
        <circle cx="198" cy="20" r="5" fill="currentColor" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}

export function StarField({ color, style, ...props }: OrnamentProps) {
  return (
    <svg
      {...props}
      style={{ ...style, color: color ?? style?.color }}
      viewBox="0 0 160 96"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="currentColor" strokeLinecap="round">
        <path d="M25 12v12M19 18h12M126 60v16M118 68h16M78 38v8M74 42h8" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
      </g>
      <g fill="currentColor">
        <circle cx="50" cy="68" r="1.2" />
        <circle cx="105" cy="20" r="1" />
        <circle cx="142" cy="35" r="1.4" />
        <circle cx="87" cy="82" r="0.9" />
      </g>
    </svg>
  );
}

const starPath = "M12 2.4l2.86 5.8 6.4.93-4.63 4.51 1.09 6.38L12 17l-5.72 3.01 1.09-6.38-4.63-4.51 6.4-.93L12 2.4Z";

export function FilledStar({ color, style, ...props }: OrnamentProps) {
  return (
    <svg
      {...props}
      style={{ ...style, color: color ?? style?.color }}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d={starPath} />
    </svg>
  );
}

export function OutlineStar({ color, style, ...props }: OrnamentProps) {
  return (
    <svg
      {...props}
      style={{ ...style, color: color ?? style?.color }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden="true"
      focusable="false"
    >
      <path d={starPath} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function MoonLock({ color, style, ...props }: OrnamentProps) {
  return (
    <svg
      {...props}
      style={{ ...style, color: color ?? style?.color }}
      viewBox="0 0 72 88"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M46 10a18 18 0 1 0 10 31A21 21 0 1 1 46 10Z" strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
        <path d="M23 49v-5a13 13 0 0 1 26 0v5" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
        <rect x="17" y="49" width="38" height="29" rx="2" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
        <circle cx="36" cy="61" r="2.7" strokeWidth="1.1" vectorEffect="non-scaling-stroke" />
        <path d="M36 64v6" strokeWidth="1.1" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}

export function CrescentMoon({ color, style, ...props }: OrnamentProps) {
  return (
    <svg
      {...props}
      style={{ ...style, color: color ?? style?.color }}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M31 7a17 17 0 1 0 10 28A20 20 0 1 1 31 7Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
