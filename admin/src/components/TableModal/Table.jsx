export default function Table({ data, onDelete, onView }) {
  const formatHeader = (key) =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

  const columns = data?.length
    ? Object.keys(data[0])
        .filter((key) => key !== "key")
        .map((key) => ({
          key,
          header: formatHeader(key),
        }))
    : [];
  return (
    <div className="bg-white overflow-clip">
      <table className="w-full text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="text-left px-4 py-3">No.</th>
            {columns.map((col,i) => (
              <th key={i} className="text-left px-4 py-3">{col.header}</th>
            ))}
            <th className="text-right px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((d, index) => (
              <tr key={index} className="border-t border-gray-200">
                <td className="px-4 py-3">{d.key}</td>
                {columns.map((col, index) => (
                  <td key={index} className="px-4 py-3">
                    {col.render ? col.render(d[col.key], d) : d[col.key]}
                  </td>
                ))}
                <td className="px-4 py-3 text-right space-x-3">
                  <button
                    onClick={() => onView(d)}
                    className="text-gray-100 bg-blue-500 px-2 py-1 rounded-xl cursor-pointer"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onDelete(d)}
                    className="text-gray-100 bg-red-500 px-2 py-1 rounded-xl cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
