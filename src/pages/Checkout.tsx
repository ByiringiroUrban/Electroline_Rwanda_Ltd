import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { ordersAPI, userNotificationsAPI } from '@/lib/api';
import { toast } from 'sonner';
import HeaderWithFeatures from '@/components/HeaderWithFeatures';
import { Check, Clock, Phone } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Confirmation
  const [orderData, setOrderData] = useState({
    shippingAddress: {
      street: '',
      city: '',
      district: '',
      phone: ''
    },
    paymentMethod: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (cart.length === 0) {
      navigate('/');
      return;
    }
  }, [user, cart, navigate]);

  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleNextStep = () => {
    if (step === 1 && (!orderData.shippingAddress.street || !orderData.shippingAddress.city || !orderData.shippingAddress.phone)) {
      toast.error('Please fill in all shipping details');
      return;
    }
    if (step === 2 && !orderData.paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    setStep(step + 1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const validCartItems = cart.filter(item => item.product && item.product._id);
      
      const order = {
        orderItems: validCartItems.map(item => ({
          product: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image
        })),
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        totalPrice: total
      };

      const response = await ordersAPI.create(order);
      
      if (response.success) {
        // Send notification to user
        await userNotificationsAPI.add(
          user.id,
          'Order Placed Successfully',
          `Your order #${response.data._id.slice(-8)} has been placed and is awaiting processing. Total: RWF ${total.toLocaleString()}`,
          'order'
        );
        
        clearCart();
        toast.success('Order placed successfully!');
        setStep(3);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!user || cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderWithFeatures />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-violet-600 text-white' : 'bg-gray-200'}`}>
              {step > 1 ? <Check className="h-4 w-4" /> : '1'}
            </div>
            <div className={`h-0.5 w-16 ${step >= 2 ? 'bg-violet-600' : 'bg-gray-200'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-violet-600 text-white' : 'bg-gray-200'}`}>
              {step > 2 ? <Check className="h-4 w-4" /> : '2'}
            </div>
            <div className={`h-0.5 w-16 ${step >= 3 ? 'bg-violet-600' : 'bg-gray-200'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-violet-600 text-white' : 'bg-gray-200'}`}>
              {step > 3 ? <Check className="h-4 w-4" /> : '3'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={orderData.shippingAddress.phone}
                        onChange={(e) => setOrderData(prev => ({
                          ...prev,
                          shippingAddress: { ...prev.shippingAddress, phone: e.target.value }
                        }))}
                        placeholder="0788123456"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={orderData.shippingAddress.city}
                        onChange={(e) => setOrderData(prev => ({
                          ...prev,
                          shippingAddress: { ...prev.shippingAddress, city: e.target.value }
                        }))}
                        placeholder="Kigali"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      value={orderData.shippingAddress.district}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        shippingAddress: { ...prev.shippingAddress, district: e.target.value }
                      }))}
                      placeholder="Gasabo"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={orderData.shippingAddress.street}
                      onChange={(e) => setOrderData(prev => ({
                        ...prev,
                        shippingAddress: { ...prev.shippingAddress, street: e.target.value }
                      }))}
                      placeholder="KG 123 St, House #456"
                      required
                    />
                  </div>
                  <Button onClick={handleNextStep} className="w-full">
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={orderData.paymentMethod} onValueChange={(value) => setOrderData(prev => ({ ...prev, paymentMethod: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash on Delivery</SelectItem>
                      <SelectItem value="mtn-momo">MTN Mobile Money</SelectItem>
                      <SelectItem value="airtel-money">Airtel Money</SelectItem>
                    </SelectContent>
                  </Select>

                  {orderData.paymentMethod === 'mtn-momo' && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <div className="bg-orange-500 text-white p-2 rounded">
                          <span className="font-bold">MTN</span>
                        </div>
                        <h3 className="ml-3 font-semibold">MTN Mobile Money Payment</h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center"><Phone className="h-4 w-4 mr-2" />Send payment to: <strong className="ml-1">0788854234</strong></p>
                        <p className="text-orange-600 font-medium">You'll receive payment instructions after placing the order.</p>
                      </div>
                    </div>
                  )}

                  {orderData.paymentMethod === 'airtel-money' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <div className="bg-red-500 text-white p-2 rounded">
                          <span className="font-bold">Airtel</span>
                        </div>
                        <h3 className="ml-3 font-semibold">Airtel Money Payment</h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center"><Phone className="h-4 w-4 mr-2" />Send payment to: <strong className="ml-1">0788854234</strong></p>
                        <p className="text-red-600 font-medium">You'll receive payment instructions after placing the order.</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Back
                    </Button>
                    <Button 
                      onClick={handlePlaceOrder} 
                      disabled={loading}
                      className="flex-1 bg-violet-600 hover:bg-violet-700"
                    >
                      {loading ? 'Processing...' : 'Place Order'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardContent className="text-center py-8">
                  <div className="mb-4">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-green-600 mb-2">Order Placed Successfully!</h2>
                  <p className="text-gray-600 mb-6">
                    Thank you for your order. You'll receive a confirmation notification shortly.
                  </p>
                  <div className="space-y-2">
                    <Button onClick={() => navigate('/profile?tab=orders')} className="w-full">
                      View My Orders
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/')} className="w-full">
                      Continue Shopping
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.product._id} className="flex items-center space-x-3">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">RWF {(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                  
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Total:</span>
                      <span className="font-bold text-lg">RWF {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;