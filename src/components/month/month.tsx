import React from "react";

import moment from "moment";
import momentJalali from "moment-jalaali";
import { ReactNode, useContext, useEffect } from "react";
import { CalendarContext, CalendarViewType } from "../calendar";

type Props = {
  date: moment.Moment;
  isLastInTable?: boolean;
  meta?: (item: moment.Moment) => ReactNode;
};

export default function Month({ date, meta }: Props) {
  let DATE_FORMAT = "MMM";

  let isCurrentMonth = false;

  const {
    selectedDate,
    viewDate,
    disabledDays,
    hoverSelectedDate,
    config,
    setViewDate,
    handleSelectDate,
    handleSelectRangeDate,
    handleHoverSelectedDate,
    handleChangeViewType,
  } = useContext(CalendarContext);

  //get system
  const system = config?.system;

  if (system === "jalali") DATE_FORMAT = `jMMMM`;

  //get today
  const today = system === "jalali" ? momentJalali() : moment();
  const todayInFormatted = today.clone().startOf("day").format(DATE_FORMAT);

  //Get isRange
  const isRangeCalendar = config?.options?.isRange ?? false;

  //Get start date if exist
  const startDate = config?.options?.startDate ?? undefined;

  //Get justBrowsing
  const isJustBrowsing = config?.options?.justBrowsing ?? undefined;

  //Get disabled days in formatted
  const disabledDaysInFormatted = disabledDays
    ? disabledDays?.map((item) => item.format(DATE_FORMAT))
    : [];

  //Get start date if exist
  const maxDate = config?.options?.maxDate ?? undefined;

  let monthClss =
    "relative day text-sm hover:bg-lightSecondary !w-full !py-2 !h-auto !min-w-[initial] rounded-2xl";

  const dateInFormatted = date.clone().startOf("month").format(DATE_FORMAT);

  if (todayInFormatted === dateInFormatted) {
    monthClss += ` border border-black`;
  }

  let DATE_YEAR_FORMAT = "YYYY";
  let DATE_YEAR_MONTH_FORMAT = "YYYY-MM";

  if (system === "jalali") DATE_YEAR_MONTH_FORMAT = `jYYYY-jMM`;
  if (system === "jalali") DATE_YEAR_FORMAT = `jYYYY`;

  //Highlight beetween dates of two dates
  if (selectedDate?.length === 1) {
    const targetDate = selectedDate?.[0]?.locale("fa");

    if (
      targetDate &&
      targetDate?.startOf("month")?.format(DATE_YEAR_MONTH_FORMAT) ===
        date?.startOf("month")?.format(DATE_YEAR_MONTH_FORMAT)
    )
      isCurrentMonth = true;

    if (
      targetDate?.startOf("month")?.format(DATE_YEAR_FORMAT) !==
      viewDate?.startOf("month")?.format(DATE_YEAR_FORMAT)
    )
      isCurrentMonth = false;
  }

  if (isCurrentMonth && !isJustBrowsing) {
    monthClss += ` selected-month !bg-primary !rounded-md hover:bg-secondary !text-white z-[1] relative`;
  }

  const selectDateHandler = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    handleChangeViewType(CalendarViewType.Days);

    if (date) setViewDate(date);

    if (isRangeCalendar) {
      handleSelectRangeDate(date);
    } else {
      handleSelectDate(date);
    }
  };

  let monthLabel = date?.locale("fa")?.format(DATE_FORMAT);

  //Check if between two range dates has disabled date
  useEffect(() => {
    if (!!hoverSelectedDate && !!selectedDate) {
      //Means first date has been selected
      if (selectedDate.length === 1) {
        const firstDate = selectedDate[0].clone();
        for (
          let m = firstDate;
          m.isBefore(hoverSelectedDate);
          m.add(1, "days")
        ) {
          if (disabledDaysInFormatted.includes(m.format(DATE_FORMAT))) {
            handleSelectDate(undefined);
          }
        }
      }
    }
  }, [hoverSelectedDate, selectedDate]);

  if (isCurrentMonth) monthClss += ` bg-lightSecondary day-in-range`;

  // if (isCurrentMonth && isShowParentDayBg) monthClss += ` !rounded-none`;

  let parentClss = "col-span-1";

  //Disabled before startdate if startdate is exist
  if (
    startDate &&
    startDate
      .clone()
      .startOf("month")
      .diff(date.clone().startOf("month"), "day") > 0
  ) {
    monthClss += ` pointer-events-none opacity-10`;
  }

  //Disabled after maxdate if maxdate is exist
  if (
    maxDate &&
    maxDate
      .clone()
      .startOf("month")
      .diff(date.clone().startOf("month"), "day") < 0
  ) {
    monthClss += ` pointer-events-none opacity-30 !border-0`;
  }

  if (meta !== undefined) monthClss += ` !flex !flex-col`;

  return (
    <div className={parentClss}>
      <button
        onClick={selectDateHandler}
        className={monthClss}
        onMouseEnter={() => handleHoverSelectedDate(date)}
        onMouseLeave={() => handleHoverSelectedDate(undefined)}
        style={{
          width: "100% !important",
        }}
      >
        {monthLabel}
        {!!meta && meta(date)}
      </button>
    </div>
  );
}
