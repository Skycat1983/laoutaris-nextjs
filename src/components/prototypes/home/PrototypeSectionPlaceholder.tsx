import type { HTMLAttributes } from "react";
import { prototypeSectionFrameClassName } from "./prototypeHomeLayout";

type PrototypeSectionTone = "hero" | "light" | "muted" | "dark";

type PrototypeSectionPlaceholderProps = {
  id: string;
  label: string;
  title: string;
  description: string;
  tone?: PrototypeSectionTone;
} & HTMLAttributes<HTMLElement>;

const toneClasses: Record<PrototypeSectionTone, string> = {
  hero: "bg-slate text-whitish",
  light: "bg-whitish text-slate",
  muted: "bg-[#ececea] text-slate",
  dark: "bg-[#171717] text-whitish",
};

export function PrototypeSectionPlaceholder({
  id,
  label,
  title,
  description,
  tone = "light",
  className = "",
  ...props
}: PrototypeSectionPlaceholderProps) {
  const headingId = `prototype-${id}-heading`;

  return (
    <section
      aria-labelledby={headingId}
      className={`w-full border-t border-current/10 ${toneClasses[tone]} ${className}`}
      data-testid={`prototype-${id}-section`}
      {...props}
    >
      <div
        className={`${prototypeSectionFrameClassName} flex min-h-[360px] flex-col justify-center gap-6 py-20`}
      >
        <div className="flex flex-col gap-3">
          <p className="font-archivo text-xs uppercase tracking-[0.18em] opacity-70">
            {label}
          </p>
          <h2
            id={headingId}
            className="max-w-4xl font-cormorant text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl"
          >
            {title}
          </h2>
        </div>
        <p className="max-w-2xl font-archivo text-base leading-7 opacity-80 sm:text-lg">
          {description}
        </p>
        <div className="mt-4 w-full border border-current/20 px-4 py-5 font-archivo text-sm uppercase tracking-[0.14em] opacity-70">
          Prototype section slot
        </div>
      </div>
    </section>
  );
}
