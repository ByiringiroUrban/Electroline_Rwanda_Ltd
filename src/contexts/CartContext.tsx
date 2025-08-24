
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cartAPI } from '@/lib/api';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cart: CartItem[]; // Add cart alias for compatibility
  cartCount: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  clearCart: () => Promise<void>; // Add clearCart method
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  const refreshCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    try {
      const response = await cartAPI.get();
      if (response.success) {
        // Filter out items with invalid product data
        const validCartItems = response.data.filter((item: any) => 
          item && item.product && item.product._id && typeof item.product.price === 'number'
        );
        setCartItems(validCartItems);
      }
    } catch (error: any) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      const response = await cartAPI.add(productId, quantity);
      if (response.success) {
        // Filter out items with invalid product data
        const validCartItems = response.data.filter((item: any) => 
          item && item.product && item.product._id && typeof item.product.price === 'number'
        );
        setCartItems(validCartItems);
        toast.success('Item added to cart');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to add item to cart');
    }
  };

  const updateCartItem = async (productId: string, quantity: number) => {
    try {
      const response = await cartAPI.update(productId, quantity);
      if (response.success) {
        // Filter out items with invalid product data
        const validCartItems = response.data.filter((item: any) => 
          item && item.product && item.product._id && typeof item.product.price === 'number'
        );
        setCartItems(validCartItems);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update cart');
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const response = await cartAPI.remove(productId);
      if (response.success) {
        // Filter out items with invalid product data
        const validCartItems = response.data.filter((item: any) => 
          item && item.product && item.product._id && typeof item.product.price === 'number'
        );
        setCartItems(validCartItems);
        toast.success('Item removed from cart');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove item');
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      // Safety check to ensure item and product exist and have valid price
      if (item && item.product && typeof item.product.price === 'number' && typeof item.quantity === 'number') {
        return total + (item.product.price * item.quantity);
      }
      return total;
    }, 0);
  };

  const clearCart = async () => {
    // Clear cart immediately in UI
    setCartItems([]);
    
    // Clear cart on server using the new clear endpoint
    if (user) {
      try {
        await cartAPI.clear();
      } catch (error) {
        console.error('Failed to clear cart on server:', error);
        // If server clearing fails, refresh to get server state
        refreshCart();
      }
    }
  };

  useEffect(() => {
    if (user) {
      refreshCart();
    }
  }, [user]);

  return (
    <CartContext.Provider value={{
      cartItems,
      cart: cartItems, // Add cart alias for compatibility
      cartCount: cartItems.length,
      addToCart,
      updateCartItem,
      removeFromCart,
      refreshCart,
      clearCart,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
