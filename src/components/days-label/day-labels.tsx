import React, { useContext, useMemo } from "react";
import Day from "./day";
import { CalendarContext, CalendarViewType } from "../calendar";
import { CalendarHolderContext } from "../calendar-holder";
import moment from "moment";

export default function DaysLabels() {
  //Get calendar context
  const { viewDate, config, viewType } = useContext(CalendarContext);

  //Get days label format
  const daysLabelFormat = config?.options?.daysLabelFormat ?? "dd";

  //Get calender holder context
  const { index } = useContext(CalendarHolderContext);

  let finalDate = viewDate ? viewDate?.clone() : moment();

  if (index > 0) finalDate = finalDate?.add(index, "month");

  const firstDayOfMonth = finalDate?.startOf("month");

  const getNextWeekLabels = useMemo(() => {
    let days = [];
    for (let i = 0; i < 7; i++) {
      days.push(
        firstDayOfMonth.clone().startOf("day").locale("fa").add(i, "day")
      );
    }

    return days.map((item) => item.format(daysLabelFormat));
  }, [firstDayOfMonth]);

  if (!config?.options?.hasDaysLabel) return null;

  if (viewType !== CalendarViewType.Days) return;

  return (
    <div className='grid grid-cols-7 pointer-events-none gap-x-0 w-full'>
      {getNextWeekLabels.map((item, key) => (
        <Day key={key} dayLabel={item} />
      ))}
    </div>
  );
}
