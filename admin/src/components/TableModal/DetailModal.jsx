import Modal from "./Modal";

export default function DetailModal({ data, onClose }) {
  return (
    <Modal onClose={onClose}>
      <h2 className="text-lg font-semibold mb-4">Product Detail</h2>

      <p className="mb-2">
        <strong>Name:</strong> {data?.name}
      </p>
      <p className="mb-2">
        <strong>Price:</strong> ${data?.price}
      </p>
      <p>
        <strong>Description:</strong> {data?.description}
      </p>

      <div className="flex justify-end mt-4">
        <button
          onClick={onClose}
          className="bg-gray-100 px-4 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
