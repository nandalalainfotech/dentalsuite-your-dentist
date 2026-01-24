import React, { useRef, useState } from "react";
import { Upload } from "lucide-react";

const PracticeMyCertificate: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [certificateName, setCertificateName] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleSave = () => {
        if (!certificateName || !file) {
            alert("Please enter certificate name and upload file");
            return;
        }

        console.log("Saving:", {
            certificateName,
            file,
        });

        // API call / FormData will go here
    };

    return (
        <div className="w-full space-y-8">
            {/* Add Certification Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-orange-500 text-lg font-semibold">
                        Add Certification
                    </h2>

                    <button
                        onClick={handleSave}
                        className="px-6 py-2 rounded-full bg-orange-500 text-white font-medium hover:bg-orange-600"
                    >
                        Save
                    </button>
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Certification Name */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Certification Name
                        </label>
                        <input
                            type="text"
                            value={certificateName}
                            onChange={(e) => setCertificateName(e.target.value)}
                            placeholder="Enter Certification Name"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                        {!certificateName && (
                            <p className="text-xs text-red-500 mt-1">
                                Name is required
                            </p>
                        )}
                    </div>

                    {/* Attachment */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Attachment
                        </label>

                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setFile(e.target.files[0]);
                                }
                            }}
                        />

                        {/* Upload Box */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-orange-400 transition"
                        >
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-3 rounded-full bg-orange-50 text-orange-500">
                                    <Upload size={20} />
                                </div>

                                {file ? (
                                    <p className="font-medium text-green-600">
                                        {file.name}
                                    </p>
                                ) : (
                                    <>
                                        <p className="font-medium">
                                            Choose an image or drag & drop it here.
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            JPG, PNG (Max 5MB)
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Certifications List */}
            <div className="bg-gray-50 rounded-xl p-10 text-center">
                <h3 className="text-orange-500 font-semibold mb-6">
                    Certifications
                </h3>

                <p className="text-gray-500">
                    No certifications available.
                </p>
            </div>
        </div>
    );
};

export default PracticeMyCertificate;
