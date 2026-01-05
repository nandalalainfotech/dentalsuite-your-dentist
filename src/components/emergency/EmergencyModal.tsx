import React from "react";

interface EmergencyModalProps {
  open: boolean;
  onClose: () => void;
}

const EmergencyModal: React.FC<EmergencyModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 md:bg-black/50"
        onClick={onClose}
      />

      {/* Modal - Responsive sizing */}
      <div className="relative z-50 w-full max-w-md bg-white rounded-lg md:rounded-xl shadow-xl md:shadow-2xl p-6 md:p-8 text-center mx-auto">
        {/* Close Button - Better positioning for mobile */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-400 hover:text-gray-700 text-xl md:text-2xl p-1 md:p-2"
          aria-label="Close"
        >
          ×
        </button>

        {/* Icon - Responsive sizing */}
        <div className="flex justify-center mb-4 md:mb-5">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 md:border-3 border-red-500 flex items-center justify-center">
            <i className="bi bi-exclamation-triangle-fill text-red-500 text-xl md:text-2xl"></i>
          </div>
        </div>

        {/* Title - Responsive typography */}
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
          Emergency Treatment
        </h2>

        {/* Content - Responsive text sizing and spacing */}
        <p className="text-gray-600 text-xs md:text-sm leading-relaxed md:leading-normal mb-5 md:mb-6 px-2 md:px-0">
          Please{" "}
          <span className="font-semibold md:font-bold text-gray-800 md:text-red-600">dial 000</span> or go to
          the nearest hospital emergency department if you have chest pains,
          uncontrolled bleeding, poisoning, constant vomiting, serious
          breathing problems, or anything else you deem as life or limb
          threatening.
        </p>

        {/* Action - Better button for mobile */}
        <button
          onClick={onClose}
          className="text-teal-600 md:text-teal-700 font-semibold hover:underline text-sm md:text-base py-2 md:py-3 px-4 md:px-6 rounded-lg hover:bg-teal-50 transition-colors"
        >
          Ok, got it
        </button>
      </div>
    </div>
  );
};

export default EmergencyModal;