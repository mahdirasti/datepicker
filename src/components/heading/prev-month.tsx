import React, { useContext } from "react";
import { CalendarContext, CalendarViewType } from "../calendar";
import moment from "moment";
import { CalendarHolderContext } from "../calendar-holder";

export default function PrevMonth() {
  //Get calendar context
  const { viewDate, setViewDate, viewType } = useContext(CalendarContext);
  const handlePrevMonth = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    let amountfChanging: any = "month";
    if (viewType === CalendarViewType.Month) amountfChanging = "year";
    setViewDate(moment(viewDate).subtract(1, amountfChanging));
  };

  //Get Calendar holder context
  const { hasPrevMonth } = useContext(CalendarHolderContext);

  if (!hasPrevMonth) return null;

  return (
    <button onClick={handlePrevMonth} className='prev-month text-primary'>
      {`>`}
    </button>
  );
}
