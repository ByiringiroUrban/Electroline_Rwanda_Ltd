
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { ordersAPI } from '@/lib/api';
import { toast } from 'sonner';

const CartDrawer = () => {
  const { cartItems, cartCount, updateCartItem, removeFromCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateCartItem(productId, newQuantity);
  };

  const handleCheckout = async () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setProcessing(true);
    try {
      const validCartItems = cartItems.filter(item => item?.product?._id);
      
      if (validCartItems.length === 0) {
        toast.error('No valid items in cart');
        return;
      }

      const orderData = {
        orderItems: validCartItems.map(item => ({
          product: item.product._id,
          name: item.product.name,
          image: item.product.image,
          price: item.product.price,
          quantity: item.quantity
        })),
        paymentMethod,
        shippingAddress: {
          address: '123 Main St',
          city: 'Kigali',
          province: 'Kigali',
          country: 'Rwanda'
        },
        taxPrice: 0,
        shippingPrice: 2000,
        totalPrice: getTotalPrice() + 2000
      };

      const response = await ordersAPI.create(orderData);
      if (response.success) {
        toast.success('Order placed successfully!');
        setShowCheckout(false);
        window.location.reload(); // Refresh to clear cart
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  // Filter out invalid cart items
  const validCartItems = cartItems.filter(item => item?.product?._id);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {cartCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {cartCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({validCartItems.length})</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {validCartItems.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Your cart is empty</p>
          ) : (
            <>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {validCartItems.map((item) => (
                  <div key={item.product._id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <img
                      src={item.product.image || '/placeholder.svg'}
                      alt={item.product.name || 'Product'}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{item.product.name || 'Unknown Product'}</h4>
                      <p className="text-sm text-gray-500">RWF {(item.product.price || 0).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFromCart(item.product._id)}
                        className="text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>RWF {getTotalPrice().toLocaleString()}</span>
                </div>
                
                {!showCheckout ? (
                  <Button
                    onClick={() => setShowCheckout(true)}
                    className="w-full mt-4 bg-violet-600 hover:bg-violet-700"
                    disabled={!user}
                  >
                    {user ? 'Proceed to Checkout' : 'Login to Checkout'}
                  </Button>
                ) : (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Payment Method</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="">Select Payment Method</option>
                        <option value="MTN Mobile Money">MTN Mobile Money</option>
                        <option value="Airtel Money">Airtel Money</option>
                        <option value="Cash on Delivery">Cash on Delivery</option>
                      </select>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowCheckout(false)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleCheckout}
                        disabled={processing}
                        className="flex-1 bg-violet-600 hover:bg-violet-700"
                      >
                        {processing ? 'Processing...' : 'Place Order'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
