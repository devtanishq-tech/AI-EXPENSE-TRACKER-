"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
type chartData = Record<string, string | number>;
// it means defining the object and theri key value pair how they looks like
type ExpenseChartPropes = {
  data: chartData[];
  labelKey: string;
};

export const description = "A bar chart with a label";

const chartConfig = {
  amount: {
    label: "Amount",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function Expensechart({ data, labelKey }: ExpenseChartPropes) {
  return (
    <Card className="border border-white/10 bg-[#171717] text-white shadow-none">
      <CardHeader>
        <CardTitle>Expense Chart</CardTitle>

        <CardDescription>Expenses grouped by {labelKey}</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />

            <XAxis
              dataKey={labelKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(`${value}-01`);

                return date.toLocaleDateString("en-US", {
                  month: "short",
                });
              }}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Bar dataKey="amount" fill="#86BDF5" radius={8} maxBarSize={64}>
              <LabelList
                dataKey="amount"
                position="top"
                offset={10}
                className="fill-white"
                fontSize={12}
                fontWeight={500}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Expense summary
          <TrendingUp className="h-4 w-4" />
        </div>

        <div className="leading-none text-muted-foreground">
          Showing expenses grouped by {labelKey}
        </div>
      </CardFooter>
    </Card>
  );
}
