import React, { useContext } from "react";
import { CalendarContext, CalendarViewType } from "../../calendar";
import { CalendarHolderContext } from "../../calendar-holder";
import moment from "moment-jalaali";
moment.loadPersian({
  usePersianDigits: true,
});

export default function MonthTitle() {
  //Get calendar context
  const {
    viewDate,
    handleChangeViewType,
    viewType,
    setViewDate,
    selectedDate,
    config,
  } = useContext(CalendarContext);

  //Get calendaer provider context
  const { index } = useContext(CalendarHolderContext);

  let finalDate = viewDate?.clone();

  let dateFormat = "MMMM";

  if (config.system === "jalali") {
    dateFormat = "jMMMM";
  }

  if (index > 0) finalDate = finalDate?.clone()?.add(index, "month");

  if (viewType === CalendarViewType.Month)
    return (
      <button
        className='w-[24px] h-[24px]'
        onClick={() => {
          handleChangeViewType(CalendarViewType.Days);
          if (selectedDate?.[0]) setViewDate(selectedDate?.[0]);
        }}
      >
        {config.undoMonthIcon ?? `<`}
      </button>
    );

  const onClickMonthTitle = () => {
    if (config?.options?.isRange) {
      return;
    }

    if (config?.options?.numberOfMonth && config?.options?.numberOfMonth > 1) {
      return;
    }

    handleChangeViewType(CalendarViewType.Month);
  };

  const locale = config.system === "jalali" ? "fa" : "en_US";

  return (
    <button
      className='!px-0 hover:!bg-transparent active:!bg-transparent !min-w-[initial]'
      type='button'
      onClick={onClickMonthTitle}
    >
      {finalDate?.locale(locale)?.format(dateFormat)}
    </button>
  );
}
