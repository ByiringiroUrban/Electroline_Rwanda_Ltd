import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Package, User, Bell } from 'lucide-react';
import HeaderWithFeatures from '@/components/HeaderWithFeatures';
import { favoritesAPI, ordersAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface Order {
  _id: string;
  orderItems: any[];
  totalPrice: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

const UserProfile = () => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const [favoritesResponse, ordersResponse] = await Promise.all([
          favoritesAPI.get(),
          ordersAPI.getMyOrders()
        ]);

        if (favoritesResponse.success) {
          // Handle both array of products and array of IDs
          const favoritesData = Array.isArray(favoritesResponse.data) 
            ? favoritesResponse.data 
            : favoritesResponse.data.favorites || [];
          setFavorites(favoritesData);
        }
        
        if (ordersResponse.success) {
          setOrders(ordersResponse.data);
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleRemoveFavorite = async (productId: string) => {
    try {
      await favoritesAPI.remove(productId);
      setFavorites(prev => prev.filter(product => product._id !== productId));
      toast.success('Removed from favorites');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove favorite');
    }
  };

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderWithFeatures />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500">Please login to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderWithFeatures />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
        
        <Tabs value={activeTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <p className="text-gray-600">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center py-8">Loading notifications...</p>
                ) : (user as any).notifications && (user as any).notifications.length > 0 ? (
                  <div className="space-y-3">
                    {(user as any).notifications
                      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((notification: any, index: number) => (
                        <div key={index} className={`p-4 rounded-lg border ${
                          notification.type === 'success' ? 'bg-green-50 border-green-200' :
                          notification.type === 'error' ? 'bg-red-50 border-red-200' :
                          notification.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                          'bg-blue-50 border-blue-200'
                        }`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{notification.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-2">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className={
                              notification.type === 'success' ? 'bg-green-100 text-green-800' :
                              notification.type === 'error' ? 'bg-red-100 text-red-800' :
                              notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }>
                              {notification.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No notifications yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  My Favorites ({favorites.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center py-8">Loading favorites...</p>
                ) : favorites.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No favorites yet</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((product) => (
                      <Card key={product._id}>
                        <CardContent className="p-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-md mb-3"
                          />
                          <h3 className="font-medium text-sm mb-2">{product.name}</h3>
                          <p className="text-lg font-bold text-violet-600 mb-3">
                            RWF {product.price.toLocaleString()}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleAddToCart(product._id)}
                              className="flex-1"
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Add to Cart
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveFavorite(product._id)}
                              className="text-red-500"
                            >
                              <Heart className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center py-8">Loading orders...</p>
                ) : orders.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No orders yet</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order._id}>
                         <CardContent className="p-4">
                           <div className="flex justify-between items-start mb-3">
                             <div>
                               <p className="font-medium">Order #{order._id.slice(-8)}</p>
                               <p className="text-sm text-gray-500">
                                 {new Date(order.createdAt).toLocaleDateString()}
                               </p>
                             </div>
                             <Badge className={
                               order.status === 'Delivered' ? 'bg-green-500' :
                               order.status === 'Approved' ? 'bg-blue-500' :
                               order.status === 'Shipped' ? 'bg-indigo-500' :
                               order.status === 'Processing' ? 'bg-yellow-500' :
                               order.status === 'Rejected' ? 'bg-red-500' :
                               'bg-gray-500'
                             }>
                               {order.status}
                             </Badge>
                           </div>
                           {order.status === 'Rejected' && (
                             <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                               <strong>Order Rejected:</strong> Please contact support for assistance.
                             </div>
                           )}
                           {order.status === 'Approved' && (
                             <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                               <strong>Order Approved:</strong> Your order will be processed and shipped soon.
                             </div>
                           )}
                          <div className="space-y-2">
                            <p className="text-sm">
                              <span className="font-medium">Items:</span> {order.orderItems.length}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Payment:</span> {order.paymentMethod}
                            </p>
                            <p className="text-lg font-bold">
                              Total: RWF {order.totalPrice.toLocaleString()}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;