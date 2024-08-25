import React, { useContext } from "react";
import { CalendarContext, CalendarViewType } from "../calendar";
import moment from "moment";
import { CalendarHolderContext } from "../calendar-holder";

export default function NextMonth() {
  //Get calendar context
  const { viewDate, setViewDate, viewType, config } =
    useContext(CalendarContext);
  const handleNextMonth = (e: any) => {
    e.stopPropagation();
    e.preventDefault();

    let amountfChanging: any = "month";
    if (viewType === CalendarViewType.Month) amountfChanging = "year";

    setViewDate(moment(viewDate).add(1, amountfChanging));
  };

  //Get Calendar holder context
  const { hasNextMonth } = useContext(CalendarHolderContext);

  if (!hasNextMonth) return null;

  return (
    <button onClick={handleNextMonth} className='next-month'>
      {config.nextMonthIcon ?? `→`}
    </button>
  );
}
