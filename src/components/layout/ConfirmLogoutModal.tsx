import React from "react";

interface ConfirmLogoutModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmLogoutModal: React.FC<ConfirmLogoutModalProps> = ({ open, onClose, onConfirm }) => {
    if (!open) return null;

    return (
        // <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        //     <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        //         <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
        //         <p className="mb-6 text-gray-700">Are you sure you want to log out?</p>
        //         <div className="flex justify-end gap-2">
        //             <button
        //                 onClick={onClose}
        //                 className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
        //             >
        //                 Cancel
        //             </button>
        //             <button
        //                 onClick={onConfirm}
        //                 className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
        //             >
        //                 Logout
        //             </button>
        //         </div>
        //     </div>
        // </div>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
                <p className="mb-6 text-gray-700">
                    Are you sure you want to sign out? You will need to log in again to access your dashboard.
                </p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmLogoutModal;