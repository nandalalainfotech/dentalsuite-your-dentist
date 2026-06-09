import API_ENDPOINTS from "../../config/api";

export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
        `${API_ENDPOINTS.UPLOADS}/file`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        throw new Error("Upload failed");
    }

    const result = await response.json();

    return result.data;
};