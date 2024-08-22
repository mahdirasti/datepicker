import { IconButton } from "@/app/components/ui";
import React, { useContext } from "react";
import { CalendarContext, CalendarViewType } from "../calendar";
import moment from "moment";
import { CalendarHolderContext } from "../calendar-holder";
import { ChevronLeft } from "lucide-react";

export default function NextMonth() {
  //Get calendar context
  const { viewDate, setViewDate, viewType } = useContext(CalendarContext);
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
    <IconButton onClick={handleNextMonth} className='next-month text-primary'>
      <ChevronLeft />
    </IconButton>
  );
}
