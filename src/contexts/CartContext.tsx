
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
  cartCount: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
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
        setCartItems(response.data);
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
        setCartItems(response.data);
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
        setCartItems(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update cart');
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const response = await cartAPI.remove(productId);
      if (response.success) {
        setCartItems(response.data);
        toast.success('Item removed from cart');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove item');
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  useEffect(() => {
    if (user) {
      refreshCart();
    }
  }, [user]);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount: cartItems.length,
      addToCart,
      updateCartItem,
      removeFromCart,
      refreshCart,
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
