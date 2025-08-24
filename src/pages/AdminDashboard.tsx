
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
import { productsAPI, notificationsAPI, newsletterAPI, ordersAPI, categoriesAPI } from "@/lib/api";
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
  category: {
    _id: string;
    name: string;
    description: string;
    image: string;
    color: string;
  };
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

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  color: string;
  isActive: boolean;
}

interface Subscriber {
  _id: string;
  email: string;
  subscribedAt: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
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

  const [categoryData, setCategoryData] = useState({
    name: '',
    description: '',
    image: '',
    color: 'bg-blue-100 text-blue-800'
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
      const [productsRes, categoriesRes, notificationsRes, subscribersRes, ordersRes] = await Promise.all([
        productsAPI.getAll({ limit: 1000 }),
        categoriesAPI.getAll(true), // Include inactive categories for admin
        notificationsAPI.getAll(),
        newsletterAPI.getSubscribers(),
        ordersAPI.getAll() // Admin should see all orders
      ]);

      console.log('API Responses:', { productsRes, categoriesRes, notificationsRes, subscribersRes, ordersRes });

      if (productsRes.success) {
        setProducts(Array.isArray(productsRes.data.products) ? productsRes.data.products : []);
      }
      
      if (categoriesRes.success) {
        setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
      }
      
      if (notificationsRes.success) {
        setNotifications(Array.isArray(notificationsRes.data) ? notificationsRes.data : []);
      }
      
      if (subscribersRes.success) {
        // Handle different possible response structures
        let subscriberList = [];
        if (Array.isArray(subscribersRes.data)) {
          subscriberList = subscribersRes.data;
        } else if (subscribersRes.data && Array.isArray(subscribersRes.data.subscribers)) {
          subscriberList = subscribersRes.data.subscribers;
        } else if (subscribersRes.data && subscribersRes.data.data && Array.isArray(subscribersRes.data.data.subscribers)) {
          subscriberList = subscribersRes.data.data.subscribers;
        }
        setSubscribers(subscriberList);
      }
      
      if (ordersRes.success) {
        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
      }
    } catch (error: any) {
      console.error('Fetch data error:', error);
      toast.error(error.message || 'Failed to fetch data');
      // Set default empty arrays on error
      setProducts([]);
      setCategories([]);
      setNotifications([]);
      setSubscribers([]);
      setOrders([]);
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
      category: product.category?._id || '',
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

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory._id, categoryData);
        toast.success('Category updated successfully!');
      } else {
        await categoriesAPI.create(categoryData);
        toast.success('Category created successfully!');
      }
      setShowCategoryForm(false);
      setEditingCategory(null);
      setCategoryData({ name: '', description: '', image: '', color: 'bg-blue-100 text-blue-800' });
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save category');
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryData({
      name: category.name,
      description: category.description,
      image: category.image,
      color: category.color
    });
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoriesAPI.delete(id);
        toast.success('Category deleted successfully!');
        fetchData();
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete category');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await ordersAPI.updateStatus(orderId, status);
      toast.success(`Order ${status.toLowerCase()} successfully!`);
      fetchData(); // Refresh the data
    } catch (error: any) {
      toast.error(error.message || 'Failed to update order status');
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
          <p className="text-gray-600">Manage your Electroline Rwanda Ltd. platform</p>
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
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
                            {categories.map((category) => (
                              <SelectItem key={category._id} value={category._id}>
                                {category.name}
                              </SelectItem>
                            ))}
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
                            <Badge variant="secondary">{product.category?.name || 'Unknown'}</Badge>
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

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Category Management</CardTitle>
                  <Button onClick={() => {
                    setShowCategoryForm(true);
                    setEditingCategory(null);
                    setCategoryData({ name: '', description: '', image: '', color: 'bg-blue-100 text-blue-800' });
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showCategoryForm && (
                  <form onSubmit={handleCreateCategory} className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingCategory ? 'Edit Category' : 'Add New Category'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="categoryName">Category Name</Label>
                        <Input
                          id="categoryName"
                          value={categoryData.name}
                          onChange={(e) => setCategoryData(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="categoryColor">Color Class</Label>
                        <Select value={categoryData.color} onValueChange={(value) => setCategoryData(prev => ({ ...prev, color: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select color" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bg-blue-100 text-blue-800">Blue</SelectItem>
                            <SelectItem value="bg-green-100 text-green-800">Green</SelectItem>
                            <SelectItem value="bg-purple-100 text-purple-800">Purple</SelectItem>
                            <SelectItem value="bg-orange-100 text-orange-800">Orange</SelectItem>
                            <SelectItem value="bg-red-100 text-red-800">Red</SelectItem>
                            <SelectItem value="bg-yellow-100 text-yellow-800">Yellow</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="categoryImage">Image URL</Label>
                        <Input
                          id="categoryImage"
                          value={categoryData.image}
                          onChange={(e) => setCategoryData(prev => ({ ...prev, image: e.target.value }))}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="categoryDescription">Description</Label>
                        <Textarea
                          id="categoryDescription"
                          value={categoryData.description}
                          onChange={(e) => setCategoryData(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button type="submit">
                        {editingCategory ? 'Update Category' : 'Add Category'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => {
                        setShowCategoryForm(false);
                        setEditingCategory(null);
                      }}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}

                {loading ? (
                  <div className="text-center py-8">Loading categories...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Color</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category._id}>
                          <TableCell>
                            <img
                              src={category.image || '/api/placeholder/50/50'}
                              alt={category.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          </TableCell>
                          <TableCell>{category.name}</TableCell>
                          <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                          <TableCell>
                            <Badge className={category.color}>{category.color.split(' ')[0].replace('bg-', '')}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={category.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                              {category.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditCategory(category)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteCategory(category._id)}
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
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell>#{order._id.slice(-8)}</TableCell>
                        <TableCell>{order.user?.name || 'N/A'}</TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{order.orderItems.length}</TableCell>
                        <TableCell>RWF {order.totalPrice.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{order.paymentMethod}</Badge>
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {order.status === 'Processing' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateOrderStatus(order._id, 'Approved')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleUpdateOrderStatus(order._id, 'Rejected')}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            {order.status === 'Approved' && (
                              <Button
                                size="sm"
                                onClick={() => handleUpdateOrderStatus(order._id, 'Shipped')}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Mark Shipped
                              </Button>
                            )}
                            {order.status === 'Shipped' && (
                              <Button
                                size="sm"
                                onClick={() => handleUpdateOrderStatus(order._id, 'Delivered')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Mark Delivered
                              </Button>
                            )}
                          </div>
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
                {loading ? (
                  <div className="text-center py-8">Loading subscribers...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Subscribed Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(subscribers) && subscribers.length > 0 ? (
                        subscribers.map((subscriber) => (
                          <TableRow key={subscriber._id}>
                            <TableCell>{subscriber.email}</TableCell>
                            <TableCell>{new Date(subscriber.subscribedAt || subscriber.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge className="bg-green-500">Active</Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                            No subscribers found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
