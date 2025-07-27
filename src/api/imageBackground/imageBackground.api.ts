import { axios } from "../http";
import {ENDPOINTS} from "../constant";

export const removeImageBackground = async (file: File): Promise<Blob> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post<Blob>(ENDPOINTS.IMAGE_BACKGROUND.REMOVE, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
    });

    return response.data;
};
