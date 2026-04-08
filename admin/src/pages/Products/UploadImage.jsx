import { useState, useRef, useEffect } from "react";
import { Upload, X } from "lucide-react";
import ConfirmModal from "../../components/ConfirmDialog";

const UploadImage = ({ onChange, images }) => {
  const inputRef = useRef(null);
  const [confirmIndex, setConfirmIndex] = useState(null);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [removedAssetIds, setRemovedAssetIds] = useState([]);

  // if(images?.length > 0){
  //   setPreviews(images)
  // }
  // ===== SELECT FILES =====
  const handleSelectFiles = (e) => {
    const selected = Array.from(e.target.files);
    if (!selected.length) return;

    const mapped = selected.map((file) => ({
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
    }));

    setFiles((prev) => [...prev, ...selected]);
    setPreviews((prev) => [...prev, ...mapped]);

    // auto set first image as main
    setActiveId((prev) => prev ?? mapped[0].id);
  };

  // ===== REMOVE IMAGE =====
  const removeConfirmed = (index) => {
    const removed = previews[index];
    console.log(removed);
    if (removed?.public_id) {
      setRemovedAssetIds((prev) =>
        prev.includes(removed.public_id) ? prev : [...prev, removed.public_id],
      );
    }
    setPreviews((prev) => {
      const updated = prev.filter((_, i) => i !== index);

      if (removed?.public_id === activeId || removed?.id === activeId) {
        setActiveId(updated[0]?.public_id || updated[0]?.id || null);
      }
      return updated;
    });

    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ===== ACTIVE IMAGE =====
  const activeImage = previews.find(
    (img) => img.id === activeId || img.public_id === activeId,
  );

  // ===== SEND FILES TO PARENT =====
  useEffect(() => {
    onChange?.(files, removedAssetIds);
  }, [files, removedAssetIds, onChange]);

  // ===== CLEANUP BLOBS =====
  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
  }, []);

  useEffect(() => {
    if (!images || images.length === 0) return;

    // prevent re-hydrating if previews already exist
    setPreviews((prev) => {
      if (prev.length > 0) return prev;

      const mapped = images.map((url) => ({
        id: crypto.randomUUID(),
        public_id: url.public_id,
        url: url.url,
        file: null, // existing image
      }));

      // set first image as active
      setActiveId(mapped[0]?.public_id ?? null);
      return mapped;
    });
  }, [images]);
  return (
    <>
      <div className="bg-gray-100 rounded-xl border border-gray-200 shadow-xl p-4 space-y-4">
        <h3 className="font-semibold">Product Images</h3>

        {/* HIDDEN INPUT */}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleSelectFiles}
          className="hidden"
        />
        {!activeImage && (
          <div className="bg-white min-h-56 rounded-xl p-2 flex justify-center items-center">
            {/* ADD BUTTON */}
            <button
              type="button"
              onClick={() => inputRef.current.click()}
              className="flex items-center gap-2 px-4 py-2 border rounded bg-white shadow text-sm"
            >
              <Upload className="w-4 h-4" />
              {previews.length === 0 ? "Add image" : "Add more"}
            </button>
          </div>
        )}
        {/* MAIN IMAGE */}
        {activeImage && (
          <>
            <div className="bg-white rounded-xl max-h-56">
              <img
                src={activeImage.url}
                alt=""
                className="w-full max-h-56 object-contain rounded"
              />
            </div>

            {/* ADD BUTTON */}
            <button
              type="button"
              onClick={() => inputRef.current.click()}
              className="flex items-center gap-2 px-4 py-2 border rounded bg-white shadow text-sm"
            >
              <Upload className="w-4 h-4" />
              {previews.length === 0 ? "Add image" : "Add more"}
            </button>
          </>
        )}
        {/* THUMBNAILS */}
        {previews.length > 0 && (
          <div className="grid grid-cols-4 gap-3">
            {previews.map((img, index) => (
              <div
                key={img.id}
                onClick={() => setActiveId(img.public_id || img.id)}
                className={`relative group cursor-pointer rounded border
                ${
                  img.id === activeId
                    ? "ring-2 ring-blue-500"
                    : "hover:ring-1 hover:ring-gray-400"
                }`}
              >
                <img
                  src={img.url.url || img.url}
                  alt=""
                  className="h-24 w-full object-cover rounded"
                />

                <button
                  type="button"
                  // onClick={(e) => {
                  //   e.stopPropagation();
                  //   handleRemove(index);
                  // }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setConfirmIndex(index);
                  }}
                  className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CONFIRM DIALOG  */}
      {confirmIndex !== null && (
        <ConfirmModal
          open={confirmIndex !== null}
          title="Remove image?"
          message="This action cannot be undone."
          confirmText="Remove"
          onCancel={() => setConfirmIndex(null)}
          onConfirm={() => {
            removeConfirmed(confirmIndex);
            setConfirmIndex(null);
          }}
        />
      )}
    </>
  );
};

export default UploadImage;
