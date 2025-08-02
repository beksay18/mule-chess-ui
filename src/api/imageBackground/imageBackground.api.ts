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

export function replaceImageBgColor(
    file: File,
    color: string,
    shape: 'square' | 'rounded' | 'circle' | 'rectangle' | 'oval',
    roundedRadius = 10,
    ovalRadius = 50
): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
            const canvasWidth = 700;
            const canvasHeight = 700;

            const canvas = document.createElement("canvas");
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            const ctx = canvas.getContext("2d");
            if (!ctx) return reject("No canvas context");

            ctx.fillStyle = color;

            ctx.save();
            if (shape === 'circle') {
                const size = Math.min(canvasWidth, canvasHeight);
                ctx.beginPath();
                ctx.arc(canvasWidth / 2, canvasHeight / 2, size / 2, 0, Math.PI * 2);
                ctx.clip();
            } else if (shape === 'oval') {
                ctx.beginPath();
                ctx.ellipse(
                    canvasWidth / 2,
                    canvasHeight / 2,
                    canvasWidth * (ovalRadius / 100),
                    canvasHeight / 2,
                    0,
                    0,
                    Math.PI * 2
                );
                ctx.clip();
            } else if (shape === 'rounded') {
                const r = (roundedRadius / 100) * Math.min(canvasWidth, canvasHeight) / 2;
                ctx.beginPath();
                ctx.moveTo(r, 0);
                ctx.lineTo(canvasWidth - r, 0);
                ctx.quadraticCurveTo(canvasWidth, 0, canvasWidth, r);
                ctx.lineTo(canvasWidth, canvasHeight - r);
                ctx.quadraticCurveTo(canvasWidth, canvasHeight, canvasWidth - r, canvasHeight);
                ctx.lineTo(r, canvasHeight);
                ctx.quadraticCurveTo(0, canvasHeight, 0, canvasHeight - r);
                ctx.lineTo(0, r);
                ctx.quadraticCurveTo(0, 0, r, 0);
                ctx.clip();
            }

            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            const aspectRatio = img.width / img.height;
            let drawWidth = canvasWidth;
            let drawHeight = drawWidth / aspectRatio;

            if (drawHeight > canvasHeight) {
                drawHeight = canvasHeight;
                drawWidth = drawHeight * aspectRatio;
            }

            const x = (canvasWidth - drawWidth) / 2;
            const y = (canvasHeight - drawHeight) / 2;

            ctx.drawImage(img, x, y, drawWidth, drawHeight);
            ctx.restore();

            return resolve(canvas.toDataURL("image/png")); // <-- added return here
        };

        img.onerror = (e) => reject(e);

        img.src = URL.createObjectURL(file);
    });
}

export const blobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });

