"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { FocusLogWithTags } from "@/types/FocusLogWithTags";

const chartConfig = {
  hours: {
    label: "Hours",
    color: "#0F172A",
  },
} satisfies ChartConfig;

export function TimeLoggedChart({
  logsWithTags,
  startDateTime,
  finishDateTime,
}: {
  logsWithTags: FocusLogWithTags[];
  startDateTime: Date;
  finishDateTime: Date;
}) {
  const [chartData, setChartData] = React.useState<
    {
      date: string;
      hours: number;
    }[]
  >();

  function formatOutputDate(date: Date): string {
    const dateString = `0${date.getDate()}`.slice(-2);
    const monthString = `0${date.getMonth() + 1}`.slice(-2);
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });
    return `${dayOfWeek}, ${dateString}.${monthString}`;
  }

  React.useEffect(() => {
    if (!logsWithTags) {
      return;
    }

    function generateBaseChartData() {
      const date = new Date(startDateTime);
      const data = [];

      while (date.getTime() <= finishDateTime.getTime()) {
        data.push({
          date: formatOutputDate(date),
          hours: 0,
        });
        date.setDate(date.getDate() + 1);
      }

      return data;
    }

    const data = generateBaseChartData();

    logsWithTags.forEach((log) => {
      if (!log.startTime) {
        return;
      }
      const date = new Date(log.startTime);
      const dateString = formatOutputDate(date);
      const existingData = data.find((item) => item.date === dateString);
      if (existingData) {
        existingData.hours += log.durationMinutes / 60;
      }
    });

    data.forEach((item) => {
      item.hours = Math.round(item.hours * 10) / 10;
    });

    setChartData(data);
  }, [logsWithTags, startDateTime, finishDateTime]);

  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[200px] max-h-[200px] w-full"
    >
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <XAxis
          dataKey="date"
          tickLine={false}
          // tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(5, 10)}
        />
        <YAxis
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => `${value}h`}
        />
        <Bar dataKey="hours" fill="var(--color-hours)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
