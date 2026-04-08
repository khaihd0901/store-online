import React from "react";
import StatsGrid from "./StatsGrid";
import ColumCharts from "./ColumCharts";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
      <div className="col-span-1 grid gap-4 z-0">
        <StatsGrid />
        <ColumCharts />
      </div>
    </div>
  );
};

export default Dashboard;
