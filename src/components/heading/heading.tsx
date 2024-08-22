import React from "react";
import PrevMonth from "./prev-month";
import NextMonth from "./next-month";
import Title from "./title/title";

export default function Heading() {
  return (
    <div className='heading flex flex-row items-center justify-between w-full'>
      <div>
        <PrevMonth />
      </div>
      <div>
        <Title />
      </div>
      <div>
        <NextMonth />
      </div>
    </div>
  );
}
