import { useState, useRef, useEffect } from "react";
export default function MultiSelectCategory({
  categories,
  selected,
  setSelected,
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const filtered = categories.filter((c) =>
    c.categoryName.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (cat) => {
    if (selected.find((s) => s._id === cat._id)) return;

    if (selected.length >= 3) {
      alert("You can select maximum 3 categories");
      return;
    }

    setSelected([...selected, cat]);
    setSearch("");
    setOpen(false);
  };

  const removeItem = (id) => {
    setSelected(selected.filter((c) => c._id !== id));
  };
  return (
    <div ref={wrapperRef} className="relative">
      {/* INPUT CONTAINER */}
      <div
        className="flex flex-wrap pl-4 pr-4 py-2.5 bg-gray-100 border border-gray-300
            rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none 
            focus:ring-2 focus:ring-[var(--color-fdaa3d)] focus:border-transparent transition-all"
        onClick={() => setOpen(true)}
      >
        {/* TAGS INSIDE INPUT */}
        {selected.map((c) => (
          <span
            key={c._id}
            className="flex items-center gap-1 px-2 py-1 bg-[var(--color-fdaa3d)] text-white rounded-full text-sm"
          >
            {c.categoryName}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeItem(c._id);
              }}
              className="text-xs"
            >
              ✕
            </button>
          </span>
        ))}

        {/* TEXT INPUT */}
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          className="flex-1 min-w-[120px] bg-transparent outline-none"
          placeholder={selected.length === 0 ? "Type category..." : ""}
        />
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute w-full bg-white border rounded-xl mt-1 max-h-40 overflow-y-auto z-50 shadow">
          {filtered.length > 0 ? (
            filtered.map((c) => {
              const isDisabled =
                selected.length >= 3 && !selected.find((s) => s._id === c._id);

              return (
                <div
                  key={c._id}
                  onClick={() => !isDisabled && handleSelect(c)}
                  className={`px-4 py-2 cursor-pointer ${
                    isDisabled
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {c.categoryName}
                </div>
              );
            })
          ) : (
            <div className="p-2 text-gray-500">No results</div>
          )}
        </div>
      )}
    </div>
  );
}
