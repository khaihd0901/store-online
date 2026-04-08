import React from "react";
import { Column } from "@ant-design/plots";
import chartsData from "../../libs/chatsData";
const ColumCharts = () => {
  const config = {
    data: chartsData,
    xField: "letter",
    yField: "value",
    label: {
      text: (d) => `${d.value}`,
      textBaseline: "bottom",
    },
    style: {
      maxWidth: 200,
      fill: () => {
        return "#febd69";
      },
    },
    scale: {
      x: { padding: 0.5 },
    },
  };
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-auto">
      <Column {...config} />
    </div>
  );
};

export default ColumCharts;
