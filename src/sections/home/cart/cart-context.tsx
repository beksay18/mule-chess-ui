import React, { createContext, useContext, useState } from 'react';

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
}

interface CartContextType {
    cartItems: CartItem[];
    addItem: (item: CartItem) => void;
    setCartItems: (items: CartItem[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addItem = (item: CartItem) => {
        setCartItems((prev) => [...prev, item]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addItem, setCartItems }}>
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