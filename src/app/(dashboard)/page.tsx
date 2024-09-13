"use client";

import { DataCharts } from "@/components/custom/dataCharts";
import { DataGrid } from "@/components/custom/dataGrid";

export default function DashboardPage() {
  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <DataGrid />
      <DataCharts />
    </div>
  );
}
