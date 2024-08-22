import React from "react";

type Props = {
  dayLabel: string;
};
export default function Day({ dayLabel }: Props) {
  return (
    <span className='col-span-1 flex flex-col items-center justify-center text-center text-black/[.87] font-normal text-xs'>
      {dayLabel}
    </span>
  );
}
