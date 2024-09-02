"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePickerWithRange({
  className,
  startDateTime,
  setStartDateTime,
  finishDateTime,
  setFinishDateTime,
}: {
  className?: string;
  startDateTime: Date;
  setStartDateTime: (date: Date) => void;
  finishDateTime: Date;
  setFinishDateTime: (date: Date) => void;
}) {
  const [selectedStartDate, setSelectedStartDate] = React.useState<
    Date | undefined
  >(startDateTime);
  const [selectedFinishDate, setSelectedFinishDate] = React.useState<
    Date | undefined
  >(finishDateTime);

  const date = React.useMemo(
    () => ({
      from: selectedStartDate,
      to: selectedFinishDate,
    }),
    [selectedStartDate, selectedFinishDate],
  );

  const setDate = React.useCallback(
    (date: DateRange | undefined) => {
      if (!date) {
        setSelectedStartDate(undefined);
        setSelectedFinishDate(undefined);
        return;
      }
      setSelectedStartDate(date.from);
      setSelectedFinishDate(date.to);

      if (date.from && date.to && date.from <= date.to) {
        const startDateTime = new Date(date.from);
        startDateTime.setHours(0, 0, 0, 0);
        setStartDateTime(startDateTime);
        const finishDateTime = new Date(date.to);
        finishDateTime.setHours(23, 59, 59, 999);
        setFinishDateTime(finishDateTime);
      }
    },
    [setStartDateTime, setFinishDateTime],
  );

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
