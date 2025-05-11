import React, { createContext, useContext, useState, useEffect } from 'react';

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
    discountTiers?: { quantity: number; percentage: number }[];
}

interface CartContextType {
    cartItems: CartItem[];
    addItem: (item: CartItem) => void;
    setCartItems: (items: CartItem[]) => void;
    removeItem: (index: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const stored = localStorage.getItem('cart');
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addItem = (item: CartItem) => {
        setCartItems((prev) => [...prev, item]);
    };

    const removeItem = (index: number) => {
        setCartItems((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <CartContext.Provider value={{ cartItems, addItem, setCartItems, removeItem }}>
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
