
import React, { createContext, useContext, useState, useEffect } from 'react';

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
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const stored = localStorage.getItem('cart');
        if (!stored) return [];
        try {
            return JSON.parse(stored);
        } catch {
            return [];
        }
    });

    useEffect(() => {
        console.log("Cart saved to localStorage:", cartItems);
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addItem = (item: CartItem) => {
        setCartItems((prev) => [...prev, item]);
    };

    const removeItem = (index: number) => {
        setCartItems((prev) => prev.filter((_, i) => i !== index));
    };

    const updateArtworkFilesForItem = async (productId: number, files: File[]) => {
        const serializedFiles = await Promise.all(files.map(fileToBase64));
        console.log("Saving serialized files:", serializedFiles);
        setCartItems((prev) =>
            prev.map((item) =>
                item.productId === productId
                    ? { ...item, artworkFiles: files, serializedArtworkFiles: serializedFiles }
                    : item
            )
        );
    };

    return (
        <CartContext.Provider value={{ cartItems, addItem, setCartItems, removeItem, updateArtworkFilesForItem }}>
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
