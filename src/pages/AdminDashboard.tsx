
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, User, Package, ShoppingCart, Bell, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { productsAPI, notificationsAPI, newsletterAPI, ordersAPI } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import HeaderWithFeatures from "@/components/HeaderWithFeatures";

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  category: string;
  countInStock: number;
  featured: boolean;
  isNew: boolean;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isActive: boolean;
  createdAt: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    description: '',
    image: '',
    category: '',
    countInStock: '',
    featured: false,
    isNew: false
  });

  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    type: 'info'
  });

  // Check if user is admin
  useEffect(() => {
    if (!user?.isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, notificationsRes, subscribersRes, ordersRes] = await Promise.all([
        productsAPI.getAll({ limit: 100 }),
        notificationsAPI.getAll(),
        newsletterAPI.getSubscribers(),
        ordersAPI.getMyOrders()
      ]);

      if (productsRes.success) setProducts(productsRes.data.products);
      if (notificationsRes.success) setNotifications(notificationsRes.data);
      if (subscribersRes.success) setSubscribers(subscribersRes.data);
      if (ordersRes.success) setOrders(ordersRes.data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isAdmin) {
      fetchData();
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        countInStock: parseInt(formData.countInStock)
      };

      if (editingProduct) {
        await productsAPI.update(editingProduct._id, productData);
        toast.success('Product updated successfully!');
      } else {
        await productsAPI.create(productData);
        toast.success('Product created successfully!');
      }

      setShowAddForm(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        originalPrice: '',
        description: '',
        image: '',
        category: '',
        countInStock: '',
        featured: false,
        isNew: false
      });
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      description: product.description,
      image: product.image,
      category: product.category,
      countInStock: product.countInStock.toString(),
      featured: product.featured,
      isNew: product.isNew
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(id);
        toast.success('Product deleted successfully!');
        fetchData();
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete product');
      }
    }
  };

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await notificationsAPI.create(notificationData);
      toast.success('Notification created successfully!');
      setShowNotificationForm(false);
      setNotificationData({ title: '', message: '', type: 'info' });
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create notification');
    }
  };

  const handleDeleteNotification = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await notificationsAPI.delete(id);
        toast.success('Notification deleted successfully!');
        fetchData();
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete notification');
      }
    }
  };

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderWithFeatures />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your RwandaStyle platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <Package className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{products.length}</p>
                <p className="text-gray-600">Total Products</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <ShoppingCart className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{orders.length}</p>
                <p className="text-gray-600">Total Orders</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{subscribers.length}</p>
                <p className="text-gray-600">Subscribers</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Bell className="h-8 w-8 text-orange-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{notifications.length}</p>
                <p className="text-gray-600">Notifications</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Product Management</CardTitle>
                  <Button onClick={() => {
                    setShowAddForm(true);
                    setEditingProduct(null);
                    setFormData({
                      name: '',
                      price: '',
                      originalPrice: '',
                      description: '',
                      image: '',
                      category: '',
                      countInStock: '',
                      featured: false,
                      isNew: false
                    });
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showAddForm && (
                  <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Shoes">Shoes</SelectItem>
                            <SelectItem value="Clothes">Clothes</SelectItem>
                            <SelectItem value="Accessories">Accessories</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="price">Price (RWF)</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="originalPrice">Original Price (RWF)</Label>
                        <Input
                          id="originalPrice"
                          name="originalPrice"
                          type="number"
                          value={formData.originalPrice}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="countInStock">Stock Count</Label>
                        <Input
                          id="countInStock"
                          name="countInStock"
                          type="number"
                          value={formData.countInStock}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="image">Image URL</Label>
                        <Input
                          id="image"
                          name="image"
                          value={formData.image}
                          onChange={handleInputChange}
                          placeholder="https://example.com/image.jpg"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={3}
                        />
                      </div>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="featured"
                            checked={formData.featured}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          Featured Product
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="isNew"
                            checked={formData.isNew}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          New Product
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button type="submit">
                        {editingProduct ? 'Update Product' : 'Add Product'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => {
                        setShowAddForm(false);
                        setEditingProduct(null);
                      }}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}

                {/* ... keep existing code (products table) */}
                {loading ? (
                  <div className="text-center py-8">Loading products...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product._id}>
                          <TableCell>
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          </TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{product.category}</Badge>
                          </TableCell>
                          <TableCell>RWF {product.price.toLocaleString()}</TableCell>
                          <TableCell>{product.countInStock}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {product.featured && <Badge className="bg-yellow-500">Featured</Badge>}
                              {product.isNew && <Badge className="bg-green-500">New</Badge>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(product._id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Notification Management</CardTitle>
                  <Button onClick={() => setShowNotificationForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Notification
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showNotificationForm && (
                  <form onSubmit={handleCreateNotification} className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4">Create New Notification</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={notificationData.title}
                          onChange={(e) => setNotificationData(prev => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          value={notificationData.message}
                          onChange={(e) => setNotificationData(prev => ({ ...prev, message: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Select value={notificationData.type} onValueChange={(value) => setNotificationData(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="info">Info</SelectItem>
                            <SelectItem value="sale">Sale</SelectItem>
                            <SelectItem value="announcement">Announcement</SelectItem>
                            <SelectItem value="warning">Warning</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button type="submit">Create Notification</Button>
                      <Button type="button" variant="outline" onClick={() => setShowNotificationForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}

                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <Card key={notification._id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{notification.title}</h4>
                              <Badge className={
                                notification.type === 'sale' ? 'bg-green-500' :
                                notification.type === 'warning' ? 'bg-yellow-500' :
                                'bg-blue-500'
                              }>
                                {notification.type}
                              </Badge>
                            </div>
                            <p className="text-gray-600">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteNotification(notification._id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell>#{order._id.slice(-8)}</TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{order.orderItems.length}</TableCell>
                        <TableCell>RWF {order.totalPrice.toLocaleString()}</TableCell>
                        <TableCell>{order.paymentMethod}</TableCell>
                        <TableCell>
                          <Badge className={
                            order.status === 'Delivered' ? 'bg-green-500' :
                            order.status === 'Shipped' ? 'bg-blue-500' :
                            order.status === 'Processing' ? 'bg-yellow-500' :
                            'bg-gray-500'
                          }>
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscribers Tab */}
          <TabsContent value="subscribers">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Subscribers</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Subscribed Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribers.map((subscriber) => (
                      <TableRow key={subscriber._id}>
                        <TableCell>{subscriber.email}</TableCell>
                        <TableCell>{new Date(subscriber.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Active</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
