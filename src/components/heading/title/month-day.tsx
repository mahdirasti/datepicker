import React, { useContext } from "react";
import { CalendarContext, CalendarViewType } from "../../calendar";
import { CalendarHolderContext } from "../../calendar-holder";

export default function MonthDay() {
  //Get calendar context
  const { viewDate, config, handleChangeViewType } =
    useContext(CalendarContext);

  //Get calendaer provider context
  const { index } = useContext(CalendarHolderContext);

  let finalDate = viewDate;

  let dateFormat = "YYYY";
  let locale = "en";

  if (config.system === "jalali") {
    locale = "fa";
    dateFormat = "jYYYY";
  }

  if (index > 0) finalDate = finalDate?.clone()?.add(index, "month");

  const onClickYearTitle = () => {
    if (config?.options?.isRange) {
      return;
    }

    if (config?.options?.numberOfMonth && config?.options?.numberOfMonth > 1) {
      return;
    }

    handleChangeViewType(CalendarViewType.Years);
  };

  return (
    <button
      className='!px-0 hover:!bg-transparent min-w-[initial] active:!bg-transparent'
      type='button'
      onClick={onClickYearTitle}
    >
      {finalDate?.locale(locale)?.format(dateFormat)}
    </button>
  );
}
