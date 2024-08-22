import React from "react";
import { ReactNode, useContext } from "react";
import moment from "moment";
import momentJalali from "moment-jalaali";
import { CalendarContext } from "../calendar";
import Year from "./year";
function getYearsBefore(
  date: moment.Moment,
  years: number = 50
): moment.Moment[] {
  const dates: moment.Moment[] = [];
  for (let i = 0; i < years; i++) {
    dates.push(date.clone().subtract(i, "years"));
  }
  return dates;
}

type Props = {
  meta?: (item: moment.Moment) => ReactNode;
};

export default function Years({ meta }: Props) {
  const { viewDate, config } = useContext(CalendarContext);

  const system = config?.system;
  const m = system === "gregorian" ? moment : momentJalali;

  //Get parent days class
  const parentDaysClass = config?.options?.parentDaysClass ?? "";

  const years = getYearsBefore(m(), 100);

  return (
    <div
      className={`grid grid-cols-4 h-auto max-h-[282px] overflow-y-auto !gap-y-2 !gap-x-1 w-full items-center justify-start flex-wrap ${parentDaysClass}`}
    >
      {years.map((date, key) => (
        <Year key={key} date={date} meta={meta} />
      ))}
    </div>
  );
}
