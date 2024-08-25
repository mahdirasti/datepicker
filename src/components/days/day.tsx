import React from "react";

import momentMain from "moment";
import momentJalali from "moment-jalaali";
import { ReactNode, useContext, useEffect } from "react";
import { CalendarContext } from "../calendar";

type Props = {
  date: moment.Moment;
  isLastInTable?: boolean;
  meta?: (item: moment.Moment) => ReactNode;
};

export default function Day({ date, isLastInTable = false, meta }: Props) {
  const {
    selectedDate,
    holidays,
    disabledDays,
    hoverSelectedDate,
    config,
    handleSelectDate,
    handleSelectRangeDate,
    handleHoverSelectedDate,
  } = useContext(CalendarContext);

  let DATE_FORMAT = "YYYY-MM-DD";

  const moment = config?.system === "gregorian" ? momentMain : momentJalali;

  if (config?.system === "jalali") DATE_FORMAT = "jYYYY-jMM-jDD";

  //get today
  let today = moment();

  const todayInFormatted = today.clone().startOf("day").format(DATE_FORMAT);

  //Get isRange
  const isRangeCalendar = config?.options?.isRange ?? false;

  //Get isShowParentDayBg
  const isShowParentDayBg = config?.options?.showParentDayBg ?? true;

  //Get start date if exist
  const startDate = config?.options?.startDate ?? undefined;

  //Get justBrowsing
  const isJustBrowsing = config?.options?.justBrowsing ?? undefined;

  //Get holidays in formatted
  const holidaysInFormatted = holidays
    ? holidays?.map((item) => item.format(DATE_FORMAT))
    : [];

  //Get disabled days in formatted
  const disabledDaysInFormatted = disabledDays
    ? disabledDays?.map((item) => item.format(DATE_FORMAT))
    : [];

  //Get start date if exist
  const maxDate = config?.options?.maxDate ?? undefined;

  //Get days extra class
  const dayClass = config?.options?.dayClass ?? "";

  let dayClss =
    "relative day text-sm w-[32px] h-[32px] flex flex-col items-center justify-center";

  const dateInFormatted = date.clone().startOf("day").format(DATE_FORMAT);
  const hoverSelectedDateInFormatted = hoverSelectedDate
    ?.clone()
    .startOf("day")
    .format(DATE_FORMAT);

  //All dates in forammted
  const selectedDates =
    selectedDate?.map((item) => {
      let date = item?.clone().startOf("day");

      if (config.system === "jalali") date = momentJalali(date);

      return date?.format(DATE_FORMAT);
    }) ?? [];

  if (todayInFormatted === dateInFormatted) {
    dayClss += ` border border-black`;
  }

  if (selectedDates.includes(dateInFormatted) && !isJustBrowsing) {
    dayClss += ` selected-day !border-0 z-[1] relative rounded-full ${
      config?.options?.selectedDayLabelClass ?? "bg-black/10"
    }`;
  }

  const selectDateHandler = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (isRangeCalendar) {
      handleSelectRangeDate(date);
    } else {
      handleSelectDate(date);
    }
  };

  let dayFormat = "D";
  let locale = "en";

  if (config.system === "jalali") {
    locale = "fa";
    dayFormat = "jD";
  }

  let dayLabel = date.locale(locale).format(dayFormat);

  let isCurrentDay = false;

  //Highlight beetween dates of two dates
  if (selectedDate?.length === 2) {
    const startOfCurrentDate = date.clone().startOf("day");
    const endOfCurrentDate = date.clone().endOf("day");

    if (
      startOfCurrentDate.diff(selectedDate[0], "days") >= 0 &&
      endOfCurrentDate.diff(selectedDate[1], "days") < 1 &&
      !selectedDates.includes(dateInFormatted)
    )
      isCurrentDay = true;
  }

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

  if (isCurrentDay && isShowParentDayBg) dayClss += ` rounded-none`;

  if (isCurrentDay)
    dayClss += ` bg-primary day-in-range ${
      config?.options?.dayInRangeClass ?? ""
    }`;

  let isShowParentBg = false;
  let parentClss = "col-span-1";

  if (dayClass) parentClss += ` ${dayClass}`;

  if (selectedDates.length === 2 && selectedDates.includes(dateInFormatted)) {
    isShowParentBg = true;
  }

  if (hoverSelectedDate && selectedDate?.length === 1 && isRangeCalendar) {
    //Diff to first selected date
    const hoverSelectedDateDiffToFirstDate = hoverSelectedDate.diff(
      selectedDate?.[0],
      "day"
    );

    if (
      hoverSelectedDateDiffToFirstDate > 0 &&
      date.clone().startOf("day").diff(selectedDate?.[0], "day") >= 0 &&
      date.clone().endOf("day").diff(hoverSelectedDate, "day") <= 0
    ) {
      isShowParentBg = true;
    }
  }

  if (isShowParentBg) {
    parentClss += ` bg-primary/20 day-in-range ${
      config?.options?.dayInRangeClass ?? ""
    }`;
    if (selectedDates[0] === dateInFormatted && isShowParentDayBg) {
      switch (config.system) {
        case "gregorian":
          parentClss += ` !rounded-tl-[16px] !rounded-bl-[16px]`;
          break;
        case "jalali":
          parentClss += ` !rounded-tr-[16px] !rounded-br-[16px]`;
          break;
      }
    } else if (
      (selectedDates[1] === dateInFormatted ||
        hoverSelectedDateInFormatted === dateInFormatted) &&
      isShowParentDayBg
    ) {
      switch (config.system) {
        case "gregorian":
          parentClss += ` !rounded-tr-[16px] !rounded-br-[16px]`;
          break;
        case "jalali":
          parentClss += ` !rounded-tl-[16px] !rounded-bl-[16px]`;
          break;
      }
    }
  }

  if (isLastInTable && isCurrentDay) {
    switch (config.system) {
      case "gregorian":
        dayClss += ` !rounded-tr-[16px] !rounded-br-[16px]`;
        break;
      case "jalali":
        dayClss += ` !rounded-tl-[16px] !rounded-bl-[16px]`;
        break;
    }
  }

  //Disabled before startdate if startdate is exist
  if (
    startDate &&
    startDate.clone().startOf("day").diff(date.clone().startOf("day"), "day") >
      0
  ) {
    dayClss += ` pointer-events-none opacity-10`;
  }

  //Disabled after maxdate if maxdate is exist
  if (
    maxDate &&
    maxDate.clone().startOf("day").diff(date.clone().startOf("day"), "day") < 0
  ) {
    dayClss += ` pointer-events-none opacity-30 !border-0`;
  }

  if (meta !== undefined) dayClss += ` !flex !flex-col`;

  //Weekend
  if (date.weekday() === 5 || date.weekday() === 6)
    dayClss += ` weekend text-red-500 ${
      config?.options?.weekendLabelClass ?? ""
    }`;

  //Holidays
  if (
    holidaysInFormatted.length > 0 &&
    holidaysInFormatted.includes(dateInFormatted)
  )
    dayClss += ` holiday !text-red-500 !border-red-500 ${
      config?.options?.holidayLabelClass ?? ""
    }`;

  //Holidays
  if (
    disabledDaysInFormatted.length > 0 &&
    disabledDaysInFormatted.includes(dateInFormatted)
  )
    dayClss += ` disabled-day pointer-events-none opacity-50`;

  return (
    <div className={parentClss}>
      <button
        onClick={selectDateHandler}
        className={dayClss}
        onMouseEnter={() => handleHoverSelectedDate(date)}
        onMouseLeave={() => handleHoverSelectedDate(undefined)}
        style={{
          width: "100% !important",
        }}
      >
        {!!meta ? meta(date) : dayLabel}
      </button>
    </div>
  );
}
