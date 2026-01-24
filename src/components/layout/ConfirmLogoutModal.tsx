import React from "react";

interface ConfirmLogoutModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmLogoutModal: React.FC<ConfirmLogoutModalProps> = ({ open, onClose, onConfirm }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-96 max-w-[90%] mx-4">
                <div className="flex flex-col items-center text-center">

                    {/* Warning Icon */}
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                        <svg
                            className="h-6 w-6 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                            />
                        </svg>
                    </div>

                    {/* Title */}
                    <h2 className="mb-2 text-xl font-bold text-slate-900">
                        Sign out?
                    </h2>

                    {/* Body Text */}
                    <p className="mb-8 text-sm leading-relaxed text-slate-500">
                        Are you sure you want to sign out? You will need to log in again to access your dashboard.
                    </p>

                    {/* Buttons Container */}
                    <div className="flex w-full gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 rounded-lg bg-slate-100 py-2.5 text-sm font-semibold text-slate-700 transition duration-200 hover:bg-slate-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-red-700 shadow-sm"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmLogoutModal;