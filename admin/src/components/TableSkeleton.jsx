import React from "react";

export default function TableSkeleton({ rows = 10 }) {
  return (
    <div className="bg-white overflow-clip">
      <table className="w-full text-sm">
        {/* HEADER */}
        <thead className="bg-gray-200">
          <tr>
            {Array.from({ length: 8 }).map((_, i) => (
              <th key={i} className="px-4 py-3 text-center">
                <div className="h-4 w-16 mx-auto bg-gray-300 rounded animate-pulse"></div>
              </th>
            ))}
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-t border-gray-200">
              {Array.from({ length: 8 }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3 text-center">
                  {/* Different skeleton types */}
                  {colIndex === 2 ? (
                    // category badges
                    <div className="flex justify-center gap-1">
                      <div className="h-5 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="h-5 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                  ) : colIndex === 7 ? (
                    // actions buttons
                    <div className="flex justify-center gap-2">
                      <div className="h-6 w-12 bg-gray-200 rounded-lg animate-pulse"></div>
                      <div className="h-6 w-14 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                  ) : (
                    // normal cell
                    <div className="h-4 w-16 mx-auto bg-gray-200 rounded animate-pulse"></div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}