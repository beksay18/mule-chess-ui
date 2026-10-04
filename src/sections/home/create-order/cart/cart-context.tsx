
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { readLocalCart, readStoredCart, writeStoredCart } from './cart-storage';

export interface SerializedFile {
    name: string;
    type: string;
    base64: string;
}

export interface CartItem {
    productId: number;
    name: string;
    price: number;
    width: number;
    height: number;
    quantity: number;
    percentage: number;
    customDimension: boolean;
    lamination: string;
    imageUrl?: string;
    previewUrl?: string;
    material?: string;
    finish?: string;
    cutType?: string;
    designId?: string;
    designJson?: string;
    discountTiers?: { quantity: number; percentage: number }[];
    materials?: { material: string; price: number }[];
    artworkFiles?: File[];
    serializedArtworkFiles?: SerializedFile[];
}

interface CartContextType {
    cartItems: CartItem[];
    addItem: (item: CartItem) => void;
    setCartItems: (items: CartItem[]) => void;
    removeItem: (index: number) => void;
    updateArtworkFilesForItem: (productId: number, files: File[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function dataUrlToFile(dataUrl: string, fileName: string): File {
    const [header, data] = dataUrl.split(',');
    const mimeMatch = header?.match(/:(.*?);/);
    const mime = mimeMatch?.[1] || 'image/png';
    const binary = atob(data || '');
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
    }
    return new File([bytes], fileName, { type: mime });
}

export function cartItemHasArtwork(item: CartItem): boolean {
    if (item.artworkFiles?.some((file) => file instanceof File && file.size > 0)) {
        return true;
    }
    if (item.serializedArtworkFiles?.some((file) => file.base64?.startsWith('data:'))) {
        return true;
    }
    return Boolean(item.previewUrl?.startsWith('data:image'));
}

export async function resolveArtworkFiles(item: CartItem): Promise<File[]> {
    const liveFiles = item.artworkFiles?.filter((file) => file instanceof File && file.size > 0) ?? [];
    if (liveFiles.length > 0) {
        return liveFiles;
    }

    const serialized = item.serializedArtworkFiles?.filter((file) => file.base64?.startsWith('data:')) ?? [];
    if (serialized.length > 0) {
        return serialized.map((file) => dataUrlToFile(file.base64, file.name || 'artwork'));
    }

    if (item.previewUrl?.startsWith('data:image')) {
        const safeName = (item.name || 'artwork').replace(/[^\w.-]+/g, '-');
        return [dataUrlToFile(item.previewUrl, `${safeName}.png`)];
    }

    return [];
}

const fileToBase64 = (file: File): Promise<SerializedFile> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () =>
            resolve({
                name: file.name,
                type: file.type,
                base64: reader.result as string,
            });
        reader.onerror = (error) => reject(error);
    });


export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(readLocalCart);
    const [ready, setReady] = useState(false);
    const userEdited = useRef(false);

    useEffect(() => {
        let cancelled = false;

        readStoredCart()
            .then((stored) => {
                if (cancelled || userEdited.current || !stored) return;
                setCartItems(stored);
            })
            .finally(() => {
                if (!cancelled) setReady(true);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!ready) return;
        writeStoredCart(cartItems).catch(() => undefined);
    }, [cartItems, ready]);

    const addItem = (item: CartItem) => {
        userEdited.current = true;
        setCartItems((prev) => [...prev, item]);
    };

    const removeItem = (index: number) => {
        userEdited.current = true;
        setCartItems((prev) => prev.filter((_, i) => i !== index));
    };

    const replaceItems = (items: CartItem[]) => {
        userEdited.current = true;
        setCartItems(items);
    };

    const updateArtworkFilesForItem = async (productId: number, files: File[]) => {
        const serializedFiles = await Promise.all(files.map(fileToBase64));
        userEdited.current = true;
        setCartItems((prev) =>
            prev.map((item) =>
                item.productId === productId
                    ? { ...item, artworkFiles: files, serializedArtworkFiles: serializedFiles }
                    : item
            )
        );
    };

    return (
        <CartContext.Provider
            value={{ cartItems, addItem, setCartItems: replaceItems, removeItem, updateArtworkFilesForItem }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
