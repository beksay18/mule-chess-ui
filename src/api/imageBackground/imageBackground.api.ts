import { axios } from "../http";
import {ENDPOINTS} from "../constant";

export type ImageShape = 'square' | 'rounded' | 'circle' | 'rectangle' | 'oval';

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
    shape: ImageShape,
    roundedRadius = 10,
    ovalRadius = 50,
    canvasWidth?: number,
    canvasHeight?: number
): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
            let finalWidth = 700;
            let finalHeight = 700;

            if (shape === 'rectangle') {
                finalWidth = canvasWidth ?? 1000;
                finalHeight = canvasHeight ?? 700;
            } else if (shape === 'oval') {
                finalWidth = canvasWidth ?? 900;
                finalHeight = canvasHeight ?? 600;
            } else if (shape === 'circle') {
                const size = canvasWidth ?? 700;
                finalWidth = size;
                finalHeight = size;
            } else if (shape === 'rounded') {
                finalWidth = canvasWidth ?? 800;
                finalHeight = canvasHeight ?? 700;
            } else {
                const size = canvasWidth ?? 700;
                finalWidth = size;
                finalHeight = size;
            }

            const canvas = document.createElement("canvas");
            canvas.width = finalWidth;
            canvas.height = finalHeight;

            const ctx = canvas.getContext("2d");
            if (!ctx) return reject("No canvas context");

            ctx.fillStyle = color;

            ctx.save();
            if (shape === 'circle') {
                const size = Math.min(finalWidth, finalHeight);
                ctx.beginPath();
                ctx.arc(finalWidth / 2, finalHeight / 2, size / 2, 0, Math.PI * 2);
                ctx.clip();
            } else if (shape === 'oval') {
                ctx.beginPath();
                ctx.ellipse(
                    finalWidth / 2,
                    finalHeight / 2,
                    finalWidth * (ovalRadius / 100),
                    finalHeight / 2,
                    0,
                    0,
                    Math.PI * 2
                );
                ctx.clip();
            } else if (shape === 'rounded') {
                const r = (roundedRadius / 100) * Math.min(finalWidth, finalHeight) / 2;
                ctx.beginPath();
                ctx.moveTo(r, 0);
                ctx.lineTo(finalWidth - r, 0);
                ctx.quadraticCurveTo(finalWidth, 0, finalWidth, r);
                ctx.lineTo(finalWidth, finalHeight - r);
                ctx.quadraticCurveTo(finalWidth, finalHeight, finalWidth - r, finalHeight);
                ctx.lineTo(r, finalHeight);
                ctx.quadraticCurveTo(0, finalHeight, 0, finalHeight - r);
                ctx.lineTo(0, r);
                ctx.quadraticCurveTo(0, 0, r, 0);
                ctx.clip();
            }

            ctx.fillRect(0, 0, finalWidth, finalHeight);

            const aspectRatio = img.width / img.height;
            let drawWidth = finalWidth;
            let drawHeight = drawWidth / aspectRatio;

            if (drawHeight > finalHeight) {
                drawHeight = finalHeight;
                drawWidth = drawHeight * aspectRatio;
            }

            const x = (finalWidth - drawWidth) / 2;
            const y = (finalHeight - drawHeight) / 2;

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

