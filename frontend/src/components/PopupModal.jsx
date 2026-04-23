// components/Modal.jsx
export default function PopupModal({ children, onClose,title }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* CONTENT */}
      <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 z-10 animate-scaleIn">
        <h1 className="font-bold">{title}</h1>
        {children}
      </div>
    </div>
  );
}