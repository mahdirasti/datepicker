import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Heading from "./heading/heading";
import DaysLabels from "./days-label/day-labels";
import Days from "./days/days";
import { CalendarContext, CalendarViewType } from "./calendar";
import Years from "./years/years";
import Months from "./month/months";

type Props = {
  index: number;
  hasNextMonth?: boolean;
  hasPrevMonth?: boolean;
  meta?: (item: moment.Moment) => ReactNode;
};

const initCalendar = {
  index: 0,
  hasNextMonth: true,
  hasPrevMonth: true,
};

export const CalendarHolderContext = createContext(initCalendar);

export default function CalendarHolder({
  index = 0,
  hasNextMonth = true,
  hasPrevMonth = true,
  meta,
}: Props) {
  const { config, viewType } = useContext(CalendarContext);

  const calendarWidth = config?.options?.calendarWidth ?? 225;

  const [calendarOptions, setCalendarOptions] = useState(initCalendar);
  useEffect(() => {
    setCalendarOptions((prev) => ({
      ...prev,
      index,
      hasNextMonth,
      hasPrevMonth,
    }));
  }, [index, hasNextMonth, hasPrevMonth]);

  let content = <Days meta={meta} />;

  if (viewType === CalendarViewType.Month) content = <Months />;
  if (viewType === CalendarViewType.Years) content = <Years />;

  return (
    <CalendarHolderContext.Provider value={calendarOptions}>
      <div
        className='flex flex-col items-center gap-y-4 mx-auto max-w-full selection:bg-transparent'
        style={{
          width: calendarWidth,
        }}
      >
        <Heading />
        <DaysLabels />
        {content}
      </div>
    </CalendarHolderContext.Provider>
  );
}
