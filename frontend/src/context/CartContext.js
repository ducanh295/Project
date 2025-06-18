import React, { createContext, useState, useContext, useEffect } from 'react';
import cartService from '../services/carService';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const data = await cartService.getCart();
            setCart(data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch cart:', err);
            setError('Failed to load cart. Please try again later.');
            setCart([]);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity) => {
        try {
            const updatedCart = await cartService.addToCart(productId, quantity);
            setCart(updatedCart);
        } catch (err) {
            console.error('Failed to add to cart:', err);
            throw err;
        }
    };

    const updateCartItem = async (productId, quantity) => {
        try {
            const updatedCart = await cartService.updateCartItem(productId, quantity);
            setCart(updatedCart);
        } catch (err) {
            console.error('Failed to update cart item:', err);
            throw err;
        }
    };

    const removeCartItem = async (productId) => {
        try {
            const updatedCart = await cartService.removeCartItem(productId);
            setCart(updatedCart);
        } catch (err) {
            console.error('Failed to remove cart item:', err);
            throw err;
        }
    };

    const clearCart = async () => {
        try {
            await cartService.clearCart();
            setCart([]);
        } catch (err) {
            console.error('Failed to clear cart:', err);
            throw err;
        }
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            error,
            fetchCart,
            addToCart,
            updateCartItem,
            removeCartItem,
            clearCart,
            getCartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
}; 