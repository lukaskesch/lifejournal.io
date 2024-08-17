"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { FocusLogWithTags } from "@/types/FocusLogWithTags";

const chartConfig = {
  minutes: {
    label: "Minutes",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export function TimeLoggedChart({
  logsWithTags,
}: {
  logsWithTags: FocusLogWithTags[];
}) {
  const [chartData, setChartData] = React.useState<
    {
      date: string;
      minutes: number;
    }[]
  >();

  function formatOutputDate(date: Date): string {
    const dateString = `0${date.getDate()}`.slice(-2);
    const monthString = `0${date.getMonth() + 1}`.slice(-2);
    return `${dateString}.${monthString}`;
  }

  React.useEffect(() => {
    if (!logsWithTags) {
      return;
    }

    function generateBaseChartData() {
      const date = new Date();
      date.setDate(date.getDate() - 29);
      const data = [];

      for (let i = 0; i < 30; i++) {
        data.push({
          date: formatOutputDate(date),
          minutes: 0,
        });
        date.setDate(date.getDate() + 1);
      }
      return data;
    }

    const data = generateBaseChartData();

    logsWithTags.forEach((log) => {
      if (!log.start_time) {
        return;
      }
      const date = new Date(log.start_time);
      const dateString = formatOutputDate(date);
      const existingData = data.find((item) => item.date === dateString);
      if (existingData) {
        existingData.minutes += log.duration_minutes;
      }
    });

    console.log("Data", data);

    setChartData(data);
  }, [logsWithTags]);

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
          tickFormatter={(value) => value.slice(0, 5)}
        />
        <YAxis
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar dataKey="minutes" fill="var(--color-minutes)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
