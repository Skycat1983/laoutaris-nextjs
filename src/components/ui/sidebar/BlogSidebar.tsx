"use client";

import HorizontalDivider from "@/components/atoms/HorizontalDivider";
import SubnavButton from "@/components/atoms/buttons/SubnavButton";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { ChevronDownIcon, MessageCircleIcon } from "lucide-react";
import { useSelectedLayoutSegment } from "next/navigation";
import React from "react";
import SubscribeForm from "../forms/SubscribeForm";

type SortRangeSidebarProps = {
  options: { label: string; queryValue: string }[];
  //   updateSortRange: (sortRange: string) => void;
};

const BlogSidebar = ({ options }: SortRangeSidebarProps) => {
  const [activeOption, setActiveOption] = React.useState(options[0].queryValue);
  const segment = useSelectedLayoutSegment();
  console.warn(segment);

  const handleClick = (option: string) => {
    setActiveOption(option);
    // updateSortRange(option);
  };

  return (
    <div id="subnav" className="w-full flex flex-col space-y-0 my-8 px-4 gap-1">
      {/* SUBSCRIBE */}
      <div>
        <p className="font-extrabold p-4">
          Subscribe now to keep up to date with developments
        </p>
      </div>
      <SubscribeForm />

      <div className="py-8">
        <HorizontalDivider />
      </div>

      {/* DIARY */}

      <div className="bg-whitish p-4">
        <h1 className="text-5xl font-archivo text-left py-8">Blog</h1>

        <p className="text-left text-lg ">
          I have been keeping a record/diary of my thoughts/progress for this
          project since the beginning- and before this website was created. You
          can read about it here.{" "}
        </p>
      </div>

      <div className="py-8">
        <HorizontalDivider />
      </div>

      {/* YEARS */}

      <h1 className="text-2xl font-archivo text-left py-4">Years</h1>
      <p className="text-left pb-8 ">
        Pick a year to narrow down the posts or choose 'All' to see everything.
      </p>

      <div className="flex flex-col gap-3 w-full">
        <Menu as="div" className="relative w-full">
          <MenuButton
            className={`px-4 py-4 text-left w-full bg-gray-100 rounded-md flex justify-between items-center ${
              activeOption ? "text-gray-700 font-bold" : "text-black font-bold"
            }`}
          >
            {options.find((option) => option.queryValue === activeOption)
              ?.label || "Select Year"}
            <ChevronDownIcon />
          </MenuButton>
          <MenuItems className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
            {options
              .sort((a, b) => b.queryValue.localeCompare(a.queryValue))
              .map((option, index) => (
                <MenuItem
                  key={index}
                  as="div"
                  onClick={() => handleClick(option.queryValue)}
                >
                  {({ active }) => (
                    <div
                      className={`block px-4 py-2 text-sm text-gray-700 font-bold ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      {option.label}
                    </div>
                  )}
                </MenuItem>
              ))}
          </MenuItems>
        </Menu>
      </div>
      <div className="py-8">
        <HorizontalDivider />
      </div>

      {/* CONTRIBUTORS */}

      <h1 className="text-2xl font-archivo text-left py-4">Contributors</h1>

      <div className="flex flex-row items-center gap-3 mt-4">
        <div>
          <img
            className="h-[35px] rounded-full"
            src={
              "https://res.cloudinary.com/dzncmfirr/image/upload/v1723539243/user-images/heron_drr8t3.png"
            }
          />
        </div>
        <div>
          <p className="text-gray-600 text-m py-2 font-bold ">
            Heron Laoutaris
          </p>
        </div>
      </div>

      <div className="flex flex-row items-center gap-3 mt-4">
        <div>
          <img
            className="h-[35px] rounded-full"
            src={
              "https://res.cloudinary.com/dzncmfirr/image/upload/v1723539243/user-images/mum_kmddm6.jpg"
            }
          />
        </div>
        <div>
          <p className="text-gray-600 text-m py-2 font-bold ">
            Katina Laoutaris
          </p>
        </div>
      </div>
      <div className="py-8">
        <HorizontalDivider />
      </div>

      <h1 className="text-2xl font-archivo text-left py-4">Recent comments</h1>
      <div className="bg-whitish p-10 rounded-tl-2xl rounded-bl-2xl rounded-br-2xl">
        {/* Recent comments */}
        <div className="bg-whitish p-4">
          <p className="text-left text-lg line-clamp-5 italic">
            <span className="font-bold">&quot;</span>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa
            corporis illo dicta tenetur omnis numquam unde cumque, facilis
            magnam harum perspiciatis ducimus est excepturi, cum consequatur
            natus ad porro sint possimus aspernatur nesciunt eius sit eligendi
            fuga. Harum omnis dolor provident, distinctio aut iste modi! Quos
            sunt dolores ipsa pariatur.
            <span className="font-bold">&quot;</span>
          </p>
        </div>
      </div>

      <div className="py-8">
        <HorizontalDivider />
      </div>

      <h1 className="text-2xl font-archivo text-left py-4">Support</h1>
      <p className="text-left pb-8 ">
        To do: tags, categories, search, share, contact, months
      </p>

      <div className="py-4">
        {/* <Button label="Donate" onClick={() => {}} classNames="btn" /> */}
        <SubnavButton title="Donate" slug="donate" />
      </div>
    </div>
  );
};

export default BlogSidebar;
