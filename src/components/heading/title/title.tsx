import React from "react";
import MonthTitle from "./month-title";
import MonthDay from "./month-day";

export default function Title() {
  return (
    <div className='flex flex-row items-center gap-x-2 !font-light text-xs'>
      <MonthTitle />
      <MonthDay />
    </div>
  );
}
