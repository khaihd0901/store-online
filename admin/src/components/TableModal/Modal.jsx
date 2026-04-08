export default function Modal({ children, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={onSubmit}
        className="bg-gray-100 rounded-xl p-6 relative min-w-7xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 text-xl cursor-pointer z-50"
        >
          ✕
        </button>

        {children}
      </form>
    </div>
  );
}
