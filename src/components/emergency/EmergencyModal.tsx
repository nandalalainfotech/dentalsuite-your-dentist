import React from "react";

interface EmergencyModalProps {
  open: boolean;
  onClose: () => void;
}

const EmergencyModal: React.FC<EmergencyModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-50 w-full max-w-md bg-white rounded-lg shadow-xl p-8 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
        >
          ×
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full border-2 border-red-500 flex items-center justify-center">
            <i className="bi bi-exclamation-triangle-fill text-red-500 text-xl"></i>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          Emergency Treatment
        </h2>

        {/* Content */}
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          Please{" "}
          <span className="font-semibold text-gray-800">dial 000</span> or go to
          the nearest hospital emergency department if you have chest pains,
          uncontrolled bleeding, poisoning, constant vomiting, serious
          breathing problems, or anything else you deem as life or limb
          threatening.
        </p>

        {/* Action */}
        <button
          onClick={onClose}
          className="text-teal-600 font-semibold hover:underline"
        >
          Ok, got it
        </button>
      </div>
    </div>
  );
};

export default EmergencyModal;
