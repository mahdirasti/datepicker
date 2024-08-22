import React, { ReactNode, useContext } from "react";
import Day from "./day";
import moment from "moment";
import momentJalali from "moment-jalaali";
import { CalendarConfig, CalendarContext } from "../calendar";
import { CalendarHolderContext } from "../calendar-holder";

function getDaysOfJalaliMonth(
  year: number,
  month: number
): momentJalali.Moment[] {
  const days: momentJalali.Moment[] = [];
  const date = momentJalali(`${year}-${month}-01`, "jYYYY-jMM-jDD");
  const daysInMonth = momentJalali(date).daysInMonth();

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(date.clone().jDate(i));
  }

  return days;
}

function getCurrentMonthDays(
  date: moment.Moment,
  calendarSystem: CalendarConfig["system"] = "gregorian"
): moment.Moment[] {
  switch (calendarSystem) {
    case "gregorian":
      const currentDate = date.clone();
      const daysInMonth = currentDate.daysInMonth();

      const daysArray: moment.Moment[] = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const currentDay = moment(currentDate).date(day);
        daysArray.push(currentDay);
      }

      return daysArray;
    case "jalali":
      const year = momentJalali(date).format("jYYYY");
      const month = momentJalali(date).format("jMM");

      const daysArrayJalali = getDaysOfJalaliMonth(+year, +month);
      return daysArrayJalali;
  }
}

type Props = {
  meta?: (item: moment.Moment) => ReactNode;
};

export default function Days({ meta }: Props) {
  const { viewDate, config } = useContext(CalendarContext);

  //Get parent days class
  const parentDaysClass = config?.options?.parentDaysClass ?? "";

  //Get calendaer provider context
  const { index } = useContext(CalendarHolderContext);

  let finalDate = viewDate;

  if (index > 0) finalDate = finalDate?.clone()?.add(index, "month");

  const days = getCurrentMonthDays(finalDate ?? moment(), config.system);

  return (
    <div
      className={`grid grid-cols-7 !gap-y-1 !gap-x-0 w-full items-center justify-start flex-wrap ${parentDaysClass}`}
    >
      {days.map((date, key) => (
        <Day
          key={key}
          date={date}
          isLastInTable={key === days.length - 1}
          meta={meta}
        />
      ))}
    </div>
  );
}
