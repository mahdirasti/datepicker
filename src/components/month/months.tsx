import React, { ReactNode, useContext } from "react";
import moment from "moment";
import momentJalali from "moment-jalaali";
import { CalendarContext } from "../calendar";
import Month from "./month";

function getCurrentYearMonths(
  date: moment.Moment,
  system: "jalali" | "gregorian" = "gregorian"
): moment.Moment[] {
  const m = system === "gregorian" ? moment : momentJalali;

  const monthsOfYear: moment.Moment[] = [];
  const startOfYearDate = date
    .clone()
    //@ts-ignore
    .startOf(system === "jalali" ? "jYear" : "year");

  if (system === "jalali") {
    for (let i = 0; i <= 12; i++) {
      const month =
        i == 0 ? startOfYearDate : m(monthsOfYear[i - 1]).add(1, "month");
      monthsOfYear.push(month);
    }
    return monthsOfYear.slice(1);
  } else {
    for (let i = 0; i <= 11; i++) {
      const month =
        i == 0 ? startOfYearDate : m(monthsOfYear[i - 1]).add(1, "month");
      monthsOfYear.push(month);
    }
    return monthsOfYear;
  }
}

type Props = {
  meta?: (item: moment.Moment) => ReactNode;
};

export default function Months({ meta }: Props) {
  const { viewDate, config } = useContext(CalendarContext);

  const system = config?.system;
  const m = system === "gregorian" ? moment : momentJalali;
  //Get parent days class
  const parentDaysClass = config?.options?.parentDaysClass ?? "";

  let finalDate = viewDate ? viewDate : undefined;

  const months = getCurrentYearMonths(finalDate ?? m(), system);
  return (
    <div
      className={`grid grid-cols-3 !gap-y-2 !gap-x-1 w-full items-center justify-start flex-wrap ${parentDaysClass}`}
    >
      {months.map((date, key) => (
        <Month
          key={key}
          date={date}
          isLastInTable={key === months.length - 1}
          meta={meta}
        />
      ))}
    </div>
  );
}
