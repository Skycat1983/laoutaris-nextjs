import type { HTMLAttributes, ReactNode } from "react";
import {
  prototypeHeadingStyle,
  prototypeSectionMutedEyebrowClassName,
  prototypeSectionFrameClassName,
} from "./prototypeHomeLayout";

type PrototypeSectionTone = "hero" | "light" | "muted" | "dark";

type PrototypeSectionPlaceholderProps = {
  id: string;
  label: string;
  title: string;
  description: string;
  details?: string[];
  media?: ReactNode;
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
  details = [],
  media,
  tone = "light",
  className = "",
  ...props
}: PrototypeSectionPlaceholderProps) {
  const headingId = `prototype-${id}-heading`;
  const hasMedia = Boolean(media);

  return (
    <section
      aria-labelledby={headingId}
      className={`w-full border-t border-current/10 ${toneClasses[tone]} ${className}`}
      data-testid={`prototype-${id}-section`}
      {...props}
    >
      <div
        className={`${prototypeSectionFrameClassName} ${
          hasMedia
            ? "grid min-h-[420px] items-center gap-10 py-16 sm:py-20 lg:grid-cols-[minmax(280px,0.7fr)_minmax(360px,1.3fr)] lg:gap-14 lg:py-24"
            : "flex min-h-[360px] flex-col justify-center gap-6 py-20"
        }`}
      >
        <div className="flex min-w-0 flex-col justify-center gap-6">
          <div className="flex flex-col gap-3">
            <p className={prototypeSectionMutedEyebrowClassName}>{label}</p>
            <h2
              id={headingId}
              className="prototype-home-section-heading max-w-4xl font-cormorant text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl"
              style={prototypeHeadingStyle({
                base: "2.75rem",
                sm: "3.5rem",
                lg: "4.5rem",
              })}
            >
              {title}
            </h2>
          </div>
          <p className="max-w-2xl font-archivo text-base leading-7 opacity-80 sm:text-lg">
            {description}
          </p>
          {details.length > 0 ? (
            <div className="flex flex-col gap-3 font-archivo text-base leading-7 opacity-75 sm:text-lg">
              {details.map((detail) => (
                <p key={detail}>{detail}</p>
              ))}
            </div>
          ) : null}
          <div className="mt-4 w-full border border-current/20 px-4 py-5 font-archivo text-sm uppercase tracking-[0.14em] opacity-70">
            Prototype section slot
          </div>
        </div>
        {media ? (
          <div className="w-full min-w-0 justify-self-end">{media}</div>
        ) : null}
      </div>
    </section>
  );
}
