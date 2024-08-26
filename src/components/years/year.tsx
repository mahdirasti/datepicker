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

export default function Year({ date, meta }: Props) {
  let DATE_FORMAT = "YYYY";

  let isCurrentYear = false;

  const {
    selectedDate,
    config,
    setViewDate,
    handleSelectDate,
    handleSelectRangeDate,
    handleChangeViewType,
  } = useContext(CalendarContext);

  //get system
  const system = config?.system;
  let locale = "en";

  if (system === "jalali") {
    DATE_FORMAT = `jYYYY`;
    locale = "fa";
  }

  //get today
  const today = system === "jalali" ? momentJalali() : moment();
  const curretnYearInFormatted = today
    .clone()
    .startOf("day")
    .format(DATE_FORMAT);

  //Get isRange
  const isRangeCalendar = config?.options?.isRange ?? false;

  //Get start date if exist
  const startDate = config?.options?.startDate ?? undefined;

  //Get justBrowsing
  const isJustBrowsing = config?.options?.justBrowsing ?? undefined;

  //Get start date if exist
  const maxDate = config?.options?.maxDate ?? undefined;

  let yearClss =
    "relative day text-sm !w-full !py-2 !h-auto !min-w-[initial] rounded-2xl";

  const dateInFormatted = date.clone().startOf("year").format(DATE_FORMAT);

  if (curretnYearInFormatted === dateInFormatted) {
    yearClss += ` border border-black`;
  }

  let DATE_YEAR_FORMAT = "YYYY";

  if (system === "jalali") DATE_YEAR_FORMAT = `jYYYY`;

  //Highlight beetween dates of two dates
  if (selectedDate?.length === 1) {
    const targetDate = selectedDate?.[0]?.locale("fa");

    if (
      targetDate &&
      targetDate?.format(DATE_YEAR_FORMAT) === date?.format(DATE_YEAR_FORMAT)
    )
      isCurrentYear = true;
  }

  if (isCurrentYear && !isJustBrowsing) {
    yearClss += ` selected-year !rounded-md z-[1] relative`;
  }

  const selectDateHandler = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    handleChangeViewType(CalendarViewType.Month);

    if (date) setViewDate(date);

    if (isRangeCalendar) {
      handleSelectRangeDate(date);
    } else {
      handleSelectDate(date);
    }
  };

  let yearLabel = date?.locale(locale)?.format(DATE_FORMAT);

  if (isCurrentYear) yearClss += ` bg-lightSecondary day-in-range`;

  // if (isCurrentYear && isShowParentDayBg) yearClss += ` !rounded-none`;

  let parentClss = "col-span-1";

  //Disabled before startdate if startdate is exist
  if (
    startDate &&
    startDate
      .clone()
      .startOf("year")
      .diff(date.clone().startOf("year"), "day") > 0
  ) {
    yearClss += ` pointer-events-none opacity-10`;
  }

  //Disabled after maxdate if maxdate is exist
  if (
    maxDate &&
    maxDate.clone().startOf("year").diff(date.clone().startOf("year"), "day") <
      0
  ) {
    yearClss += ` pointer-events-none opacity-30 !border-0`;
  }

  if (meta !== undefined) yearClss += ` !flex !flex-col`;

  return (
    <div className={parentClss}>
      <button
        onClick={selectDateHandler}
        className={yearClss}
        style={{
          width: "100% !important",
        }}
      >
        {yearLabel}
        {!!meta && meta(date)}
      </button>
    </div>
  );
}
