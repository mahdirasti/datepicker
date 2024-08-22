"use client";

import { createContext, ReactNode, useEffect, useState } from "react";

import momentMain from "moment";
import jalaliMoment from "moment-jalaali";
import CalendarHolder from "./calendar-holder";

export type MomentDateType = any;

export type CalendarConfig = {
  system?: "gregorian" | "jalali";
  options: {
    calendarWidth?: string | number;
    parentDaysClass?: string;
    dayClass?: string;
    hasDaysLabel?: boolean;
    showParentDayBg?: boolean;
    dayLabelClass?: string;
    daysLabelFormat?: string;
    isRange?: boolean;
    numberOfMonth?: number;
    startDate?: MomentDateType;
    maxDate?: MomentDateType;
    justBrowsing?: boolean;
  };
};

const initConfig: CalendarConfig = {
  system: "gregorian",
  options: {
    calendarWidth: 225,
    hasDaysLabel: true,
    showParentDayBg: true,
    daysLabelFormat: "dd",
    isRange: false,
    numberOfMonth: 1,
    startDate: undefined,
    maxDate: undefined,
    parentDaysClass: undefined,
    dayClass: undefined,
    dayLabelClass: undefined,
    justBrowsing: false,
  },
};

export enum CalendarViewType {
  Days = 1,
  Month = 2,
  Years = 3,
}

export const CalendarContext = createContext<{
  config: CalendarConfig;
  viewType: CalendarViewType;
  handleChangeViewType: (vt: CalendarViewType) => void;
  selectedDate?: MomentDateType[];
  holidays?: MomentDateType[];
  disabledDays?: MomentDateType[];
  handleSelectDate: (date?: MomentDateType) => void;
  handleSelectRangeDate: (date: MomentDateType) => void;
  viewDate?: MomentDateType;
  setViewDate: (date: MomentDateType) => void;
  hoverSelectedDate?: MomentDateType;
  handleHoverSelectedDate: (date?: MomentDateType) => void;
}>({
  config: initConfig,
  viewType: CalendarViewType.Days,
  handleChangeViewType: (vt) => {},
  selectedDate: undefined,
  holidays: undefined,
  disabledDays: undefined,
  handleSelectDate: (date) => {},
  handleSelectRangeDate: (date) => {},
  viewDate: undefined,
  setViewDate: (date) => {},
  hoverSelectedDate: undefined,
  handleHoverSelectedDate: (date) => {},
});

export type CalendarProps = {
  config?: CalendarConfig;
  holidays?: MomentDateType[];
  disabledDays?: MomentDateType[];
  defaultDate?: MomentDateType[] | MomentDateType;
  onSelectDate?: (date: MomentDateType) => void;
  onSelectRangeDate?: (date: MomentDateType[]) => void;
  onChangeViewDate?: (date: MomentDateType) => void;
  meta?: (item: MomentDateType) => ReactNode;
};

export default function Calendar2({
  config,
  holidays,
  disabledDays,
  defaultDate,
  onSelectDate,
  onSelectRangeDate,
  onChangeViewDate,
  meta,
}: CalendarProps) {
  //View type - Month & Year & Days
  const [viewType, setViewType] = useState<CalendarViewType>(
    CalendarViewType.Days
  );
  const handleChangeViewType = (vt: CalendarViewType) => {
    setViewType(vt);
  };

  //Config
  const [stateConfig, setStateConfig] = useState<CalendarConfig>(initConfig);
  useEffect(() => {
    if (config !== undefined)
      setStateConfig({
        system: config?.system ?? "gregorian",
        options: {
          ...initConfig?.options,
          ...config?.options,
        },
      });
  }, [config]);

  const moment =
    stateConfig?.system === "gregorian" ? momentMain : jalaliMoment;

  //Selected date
  const [selectedDate, setSelectedDate] = useState<MomentDateType[]>([]);
  useEffect(() => {
    if (defaultDate !== undefined) {
      setSelectedDate(Array.isArray(defaultDate) ? defaultDate : [defaultDate]);
    } else {
      setSelectedDate([moment()]);
    }
  }, [defaultDate]);

  //Hover selected date
  const [hoverSelectedDate, setHoverSelectedDate] = useState<MomentDateType>();
  const handleHoverSelectedDate = (date?: MomentDateType) =>
    setHoverSelectedDate(date);

  //Handling simple selection date
  const handleSelectDate = (date: MomentDateType | undefined) => {
    if (date === undefined) {
      setSelectedDate([]);
      return;
    }

    setSelectedDate([date]);
    if (onSelectDate) onSelectDate(date);
  };

  //Handling range selection date
  const handleSelectRangeDate = (date: MomentDateType) => {
    setSelectedDate((prev) => {
      //Means first date has is selected
      if (prev.length === 1) {
        const startOfSelectedDate = date.clone().startOf("day");

        //De select the first date whenever user click on the same cell
        if (
          startOfSelectedDate.format("YYYY-MM-DD") ===
          prev[0].clone().startOf("day").format("YYYY-MM-DD")
        ) {
          return [];
        }

        //Means second selection date is lower than first date
        if (startOfSelectedDate.diff(prev[0], "day") < 0) {
          return [date];
        }

        //Call on select range date
        if (onSelectRangeDate) onSelectRangeDate([...prev, date]);

        return [...prev, date];
      }

      return [date];
    });
  };

  //Active date
  const [viewDate, setViewDate] = useState<MomentDateType | undefined>(
    undefined
  );

  useEffect(() => {
    if (viewDate !== undefined) return;

    if (defaultDate !== undefined) {
      if (Array.isArray(defaultDate) && defaultDate.length === 0) {
        setViewDate(moment());
        return;
      }
      if (Array.isArray(defaultDate) && defaultDate.length === 0) return;

      setViewDate(Array.isArray(defaultDate) ? defaultDate[0] : defaultDate);
    } else {
      setViewDate(moment());
    }
  }, [defaultDate, viewDate]);

  const handleChangeViewDate = (date: MomentDateType) => {
    setViewDate(date);
    if (onChangeViewDate) onChangeViewDate(date);
  };

  const numberOfCalendar = stateConfig?.options?.numberOfMonth ?? 1;
  const isSingleCalendar = numberOfCalendar === 1;

  const calendarAsArray = Array.from(Array(numberOfCalendar).keys());

  let finalViewDate = viewDate;

  if (stateConfig.system === "jalali")
    finalViewDate = jalaliMoment(finalViewDate);

  return (
    <CalendarContext.Provider
      value={{
        config: stateConfig,
        viewType,
        handleChangeViewType,
        holidays,
        disabledDays,
        selectedDate,
        handleSelectDate,
        handleSelectRangeDate,
        hoverSelectedDate,
        handleHoverSelectedDate,
        viewDate: finalViewDate,
        setViewDate: handleChangeViewDate,
      }}
    >
      <div className='flex flex-row items-start gap-x-4'>
        {calendarAsArray.map((_, index) => (
          <CalendarHolder
            index={index}
            key={index}
            hasNextMonth={
              isSingleCalendar || index === calendarAsArray.length - 1
            }
            hasPrevMonth={isSingleCalendar || index === 0}
            meta={meta}
          />
        ))}
      </div>
    </CalendarContext.Provider>
  );
}
