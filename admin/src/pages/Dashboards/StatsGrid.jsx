import React from "react";
import statsData from "../../libs/statsData";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
const StatsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">
                {stat.title}
              </p>
              <p className="text-xl font-bold text-gray-800 mb-4">
                {stat.value}
              </p>
              <div className="flex items-center space-x-2">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-semibold ${stat.trend == "up" ? 'text-emerald-500' : 'text-red-500'}`}>{stat.change}</span>
                <span className="text-sm text-gray-500">vs Last Month</span>
              </div>
            </div>

            <div className={`p-3 rounded-xl group-hover:scale-110 transition-all duration-300`}>
              {<stat.icon className={`w-6 h-6 ${stat.textColor}`}/>}
            </div>
          </div>
          {/* ProgressBar  */}
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[var(--color-febd69)] rounded-full transition-all duration-100" style={{width: stat.trend === "up" ? '75%' : "45%"}}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
