"use client";

import { useModal } from "@/components/modal/modal-context";

export default function BuyModal() {
  const { isOpen, closeModal } = useModal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">Modal Title</h2>
        <p className="mb-4">This is your modal content.</p>
        <button onClick={closeModal} className="text-blue-500 underline">
          Close
        </button>
      </div>
    </div>
  );
}