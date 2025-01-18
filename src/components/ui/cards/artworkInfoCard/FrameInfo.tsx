import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface IFrameInfoProps {
  info: IFrameInfo;
  label: string;
}

interface IFrameInfo {
  height: number;
  width: number;
  material: string;
  style: string;
}

type FrameInfoPairProps = {
  property: string;
  value: string | number;
};

const FrameInfoPair = ({ property, value }: FrameInfoPairProps) => {
  return (
    <div className="flex flex-row gap-2 w-full">
      <p className="font-archivo text-md font-bold text-gray-500">{property}</p>
      <p className="font-archivo text-md font-light text-gray-500">{value}</p>
    </div>
  );
};

const FrameInfo = ({ info, label }: IFrameInfoProps) => {
  const { height, width, material, style } = info;
  return (
    <Disclosure>
      <DisclosureButton className="py-2 text-left ">
        <div className="flex flex-row justify-between" data-open>
          <p className="font-archivo text-md font-light text-gray-500">
            {label}
          </p>

          <ChevronDown className="w-6 h-6 data-[open]:rotate-180" />

          {/* <span className="mr-2 ui-open:rotate-180 material-symbols-outlined">
            expand_more
          </span> */}
        </div>
      </DisclosureButton>
      <DisclosurePanel className="text-gray-500">
        <div className="flex flex-row flex-wrap gap-2">
          <div className="flex flex-col w-full">
            <FrameInfoPair property="Height:" value={height} />
            <FrameInfoPair property="Width:" value={width} />
            <FrameInfoPair property="Material:" value={material} />
            <FrameInfoPair property="Style:" value={style} />
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default FrameInfo;
