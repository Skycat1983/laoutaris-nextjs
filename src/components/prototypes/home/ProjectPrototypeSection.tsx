import Link from "next/link";
import { ArrowRight } from "lucide-react";
import YoutubeEmbedding from "@/components/elements/misc/YoutubeEmbedding";
import {
  prototypeHeadingStyle,
  prototypeSectionFrameClassName,
  prototypeSectionMutedEyebrowClassName,
} from "./prototypeHomeLayout";

const projectVideoId = "6ynF2gO-J30";
const projectTitle = "Watch the documentary";
const projectIntro =
  "A short film exploring the life, ethos, and regrets of Joseph Laoutaris.";
const projectDetails = [
  "The life, ethos & regrets of Joseph Laoutaris",
  "A short film about my grandfather",
  "By Heron Laoutaris",
];

const desktopHeadingStyle = prototypeHeadingStyle({
  base: "2.75rem",
  sm: "3.5rem",
  lg: "4.5rem",
});

function ProjectPrototypeVideo({ testId }: { testId: string }) {
  return (
    <div
      className="w-full overflow-hidden border border-current/15 bg-black shadow-sm"
      data-testid={testId}
    >
      <YoutubeEmbedding videoId={projectVideoId} />
    </div>
  );
}

export function ProjectPrototypeSection() {
  return (
    <section
      aria-label="Project: Watch the documentary"
      className="prototype-home-primary-bg w-full border-t border-current/10 text-slate"
      data-testid="prototype-project-section"
    >
      <div className="md:hidden" data-testid="prototype-mobile-project">
        <div className="mx-auto flex w-full max-w-[430px] flex-col bg-[#f8f7f4] px-5 pb-12 pt-14 text-slate sm:px-8 sm:pb-16 sm:pt-16">
          <p className="font-archivo text-sm uppercase tracking-[0.24em] text-slate/75">
            Project
          </p>
          <h2
            className="mt-9 max-w-[9ch] break-words font-cormorant text-[3.5rem] font-semibold leading-[0.95] text-slate sm:text-[4.5rem]"
          >
            {projectTitle}
          </h2>
          <div className="mt-9 h-px w-10 bg-slate/15" aria-hidden="true" />
          <p className="mt-9 max-w-[20rem] font-archivo text-xl leading-8 text-slate/85">
            {projectIntro}
          </p>

          <div className="-mx-5 mt-10 sm:-mx-8">
            <ProjectPrototypeVideo testId="prototype-mobile-project-video" />
          </div>

          <dl className="mt-10 divide-y divide-slate/15 font-archivo text-lg leading-7 text-slate sm:text-xl">
            {projectDetails.map((detail, index) => (
              <div key={detail} className={index === 0 ? "pb-5" : "py-5"}>
                <dt className="sr-only">
                  {index === 0
                    ? "Documentary subtitle"
                    : index === 1
                      ? "Documentary description"
                      : "Documentary credit"}
                </dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>

          <Link
            href="/project/film"
            className="mt-10 inline-flex min-h-[64px] w-full items-center justify-between border border-slate px-7 font-archivo text-sm uppercase tracking-[0.24em] text-slate transition-colors hover:bg-slate hover:text-whitish focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate sm:min-h-[72px] sm:px-9 sm:text-base"
          >
            <span>Watch on film page</span>
            <ArrowRight aria-hidden="true" className="h-7 w-7 shrink-0" />
          </Link>
        </div>
      </div>

      <div className="hidden md:block" data-testid="prototype-desktop-project">
        <div
          className={`${prototypeSectionFrameClassName} grid min-h-[420px] items-center gap-10 py-16 sm:py-20 lg:grid-cols-[minmax(280px,0.7fr)_minmax(360px,1.3fr)] lg:gap-14 lg:py-24`}
        >
          <div className="flex min-w-0 flex-col justify-center gap-6">
            <div className="flex flex-col gap-3">
              <p className={prototypeSectionMutedEyebrowClassName}>
                Project:
              </p>
              <h2
                className="prototype-home-section-heading max-w-4xl font-cormorant text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl"
                style={desktopHeadingStyle}
              >
                {projectTitle}
              </h2>
            </div>
            <p className="max-w-2xl font-archivo text-base leading-7 opacity-80 sm:text-lg">
              The life, ethos & regrets of Joseph Laoutaris
            </p>
            <div className="flex flex-col gap-3 font-archivo text-base leading-7 opacity-75 sm:text-lg">
              <p>A short film about my grandfather</p>
              <p>By Heron Laoutaris</p>
            </div>
            <div className="mt-4 w-full border border-current/20 px-4 py-5 font-archivo text-sm uppercase tracking-[0.14em] opacity-70">
              Prototype section slot
            </div>
          </div>
          <div className="w-full min-w-0 justify-self-end">
            <ProjectPrototypeVideo testId="prototype-project-video" />
          </div>
        </div>
      </div>
    </section>
  );
}
