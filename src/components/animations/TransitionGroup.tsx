"use client";

import { Transition } from "@headlessui/react";
import { useEffect, useState } from "react";

interface TransitionGroupProps {
  appear?: boolean;
  isShowing: boolean;
  textColour: string;
  textDirection?: "left" | "right";
  title: string;
  subtitle: string;
  author: string;
}

const TransitionGroup: React.FC<TransitionGroupProps> = ({
  appear = true,
  isShowing,
  textColour,
  textDirection = "right",
  title,
  subtitle,
  author,
}) => {
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showAuthor, setShowAuthor] = useState(false);
  const [showDivider, setShowDivider] = useState(false);

  useEffect(() => {
    if (isShowing) {
      const timer1 = setTimeout(() => setShowTitle(true), 0);
      const timer2 = setTimeout(() => setShowSubtitle(true), 100);
      const timer3 = setTimeout(() => setShowAuthor(true), 200);
      const timer4 = setTimeout(() => setShowDivider(true), 300);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    } else {
      const timer1 = setTimeout(() => setShowAuthor(false), 0);
      const timer2 = setTimeout(() => setShowSubtitle(false), 100);
      const timer3 = setTimeout(() => setShowTitle(false), 200);
      const timer4 = setTimeout(() => setShowDivider(false), 100);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [isShowing]);

  const divClassName =
    textDirection === "left"
      ? "col-start-1 col-end-1 text-left justify-self-end w-[300px]"
      : "col-start-1 col-end-1 text-right justify-self-end w-[300px]";

  return (
    <div className="grid gap-10 justify-items-stretch w-full text-black">
      {/* <div className="col-start-1 col-end-1 text-right justify-self-end w-[300px]"> */}
      <div className={divClassName}>
        <Transition
          appear={appear}
          unmount={true}
          show={showTitle}
          enter="transition-height-opacity-transform duration-500 out"
          enterFrom="-translate-x-[150px] opacity-0 "
          enterTo="translate-x-0 opacity-100 "
          leave="transition-height-opacity-transform duration-500 in"
          leaveFrom="opacity-100 -translate-x-0"
          leaveTo="opacity-0 translate-x-[150px]"
        >
          <h1
            className="text-6xl fontface-crimson font-thin"
            style={{ color: textColour }}
          >
            {title}
          </h1>
        </Transition>

        <Transition
          appear={appear}
          unmount={true}
          show={showSubtitle}
          enter="transition-height-opacity-transform duration-500 out"
          enterFrom="translate-x-[150px] opacity-0 "
          enterTo="-translate-x-0 opacity-100 "
          leave="transition-height-opacity-transform duration-500 in"
          leaveFrom="opacity-100 translate-x-0"
          leaveTo="opacity-0 -translate-x-[100px]"
        >
          {/* <h2 className="text-3xl py-4" style={{ color: textColour }}>
              {subtitle}
            </h2> */}
          {/* <h2
              className="text-xl py-4 font-archivo"
              style={{ color: textColour }}
            >
              {subtitle}
            </h2> */}
          <h2
            className="text-xl py-4 font-besley"
            style={{ color: textColour }}
          >
            {subtitle}
          </h2>
          {/* <h2
              className="text-xl py-4 font-archivo"
              style={{ color: textColour }}
            >
              {subtitle}
            </h2> */}
        </Transition>

        <Transition
          appear={appear}
          unmount={true}
          show={showAuthor}
          enter="transition-height-opacity-transform duration-500 out"
          enterFrom="-translate-x-[150px] opacity-0 "
          enterTo="translate-x-0 opacity-100 "
          leave="transition-height-opacity-transform duration-500 in"
          leaveFrom="opacity-100 translate-x-0"
          leaveTo="opacity-0 translate-x-[100px]"
        >
          <h3
            className="fontface-archivo font-bold py-1"
            style={{ color: textColour }}
          >
            {author}
          </h3>
        </Transition>
      </div>
      {/* <div className="col-start-2 col-end-2 w-[4px] h-[150px]"> */}
      <div className="col-start-2 col-end-2 w-[4px] h-full">
        <Transition
          appear={appear}
          unmount={true}
          show={showDivider}
          enter="transition-height-opacity-transform duration-500 out"
          enterFrom="-translate-y-[150px] opacity-0 "
          enterTo="translate-x-0 opacity-100 "
          leave="transition-height-opacity-transform duration-500 in"
          leaveFrom="opacity-100 translate-x-0"
          leaveTo="opacity-0 translate-y-[100px]"
        >
          <div
            className="bg-black w-[4px] h-[150px]"
            // className="bg-black w-[4px] h-full flex"
            style={{ backgroundColor: textColour }}
          ></div>
        </Transition>
      </div>
    </div>
  );
};

export default TransitionGroup;
