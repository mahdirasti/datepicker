import React, { useContext } from "react";
import { CalendarContext, CalendarViewType } from "../../calendar";
import { CalendarHolderContext } from "../../calendar-holder";

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
    finalDate = finalDate?.locale("fa");
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
        {`<-`}
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

  return (
    <button
      className='!px-0 hover:!bg-transparent active:!bg-transparent !text-black/60 !min-w-[initial]'
      type='button'
      onClick={onClickMonthTitle}
    >
      {finalDate?.format(dateFormat)}
    </button>
  );
}
