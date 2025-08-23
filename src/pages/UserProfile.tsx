
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Package, User } from 'lucide-react';
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Favorites ({favorites.length})
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Orders ({orders.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-lg">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-lg">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Account Type</label>
                  <Badge className={user.isAdmin ? 'bg-purple-500' : 'bg-blue-500'}>
                    {user.isAdmin ? 'Admin' : 'Customer'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>My Favorites</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center py-8">Loading favorites...</p>
                ) : favorites.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No favorites yet</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((product) => (
                      <Card key={product._id}>
                        <CardContent className="p-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-40 object-cover rounded mb-3"
                          />
                          <Badge variant="secondary" className="mb-2">
                            {product.category}
                          </Badge>
                          <h4 className="font-medium mb-2">{product.name}</h4>
                          <p className="text-lg font-bold mb-3">
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
                <CardTitle>Order History</CardTitle>
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
