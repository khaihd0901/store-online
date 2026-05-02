import { ArrowUp, ArrowDown } from "lucide-react";
export default function Table({
  data,
  onDelete,
  onRestore,
  onView,
  onSort,
  sortKey,
  sortOrder,
  onFilter,
  categories,
}) {
  const columnConfig = {
    name: { sortable: false },
    author: { sortable: false },
    category: { filter: "select" },
    stock: { sortable: true },
    sold: { sortable: true },
    price: { sortable: true },
    hotStatus: { filter: "select" },
  };
  const formatHeader = (key) =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

  const hiddenFields = ["key", "id"];

  const columns = data?.length
    ? Object.keys(data[0])
        .filter((key) => !hiddenFields.includes(key))
        .map((key) => ({
          key,
          header: formatHeader(key),
          config: columnConfig[key] || {},
        }))
    : [];

  if (data.length <= 0)
    return (
      <div className="p-4 font-bold text-2xl text-center">
        No Data Available
      </div>
    );

  return (
    <div className="bg-white overflow-visible">
      <table className="w-full text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-3 text-center">No.</th>

            {columns.map((col, i) => (
              <th
                key={i}
                className={`px-4 py-3 text-center ${
                  col.config.sortable ? "cursor-pointer" : ""
                }`}
                onClick={() => col.config.sortable && onSort && onSort(col.key)}
              >
                <div className="flex items-center justify-center gap-1">
                  {!["category", "hotStatus"].includes(col.key) && col.header}

                  {col.config.sortable && sortKey === col.key && (
                    <>
                      {sortOrder === "asc" ? (
                        <ArrowUp size={16} />
                      ) : (
                        <ArrowDown size={16} />
                      )}
                    </>
                  )}
                </div>

                {/* CATEGORY FILTER */}
                {col.key === "category" && onFilter && (
                  <select
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      const value = e.target.value;

                      onFilter("category", value === "" ? undefined : value);
                    }}
                    className="mt-1 w-fit px-2 py-1 border rounded text-xs mx-auto block"
                  >
                    <option value="">All Categories</option> {/* ✅ THIS */}
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                )}

                {/* HOT FILTER */}
                {col.key === "hotStatus" && onFilter && (
                  <select
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      const value = e.target.value;
                      onFilter(
                        "isHot",
                        value === "" ? undefined : value === "true",
                      );
                    }}
                    className="mt-1 w-fit px-2 py-1 border rounded text-xs mx-auto block"
                  >
                    <option value="">Hot Status</option>
                    <option value="false">Normal</option>
                    <option value="true">Hot</option>
                  </select>
                )}
              </th>
            ))}

            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((d, index) => (
            <tr key={index} className="border-t border-gray-200">
              <td className="px-4 py-3 text-center">{d.key}</td>

              {columns.map((col, i) => (
                <td key={i} className="px-4 py-3 text-center">
                  {d[col.key]}
                </td>
              ))}

              <td className="px-4 py-3 text-center flex justify-center gap-3">
                <button
                  onClick={() => onView(d)}
                  className="bg-blue-500 text-white px-2 py-1 rounded-xl"
                >
                  View
                </button>

                {onRestore ? (
                  <button
                    onClick={() => onRestore(d)}
                    className="bg-green-500 text-white px-2 py-1 rounded-xl"
                  >
                    Restore
                  </button>
                ) : (
                  <button
                    onClick={() => onDelete(d)}
                    className="bg-red-500 text-white px-2 py-1 rounded-xl"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
