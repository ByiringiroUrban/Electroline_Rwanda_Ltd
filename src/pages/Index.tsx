import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Menu, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext";
import { productsAPI, newsletterAPI } from "@/lib/api";
import { toast } from "sonner";
import Header from "@/components/Header";

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  category: string;
  rating: number;
  numReviews: number;
  featured: boolean;
  isNew: boolean;
  discount?: string;
}

interface Category {
  name: string;
  description: string;
  bgImage: string;
  color: string;
  count: number;
}

const Index = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const categories: Category[] = [
    {
      name: 'Shoes',
      description: 'Step into style with our diverse shoe collection.',
      bgImage: 'https://images.unsplash.com/photo-1542296636-e39e98198c94?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
      color: 'bg-blue-100 text-blue-800',
      count: 28
    },
    {
      name: 'Clothes',
      description: 'Dress to impress with our trendy clothing line.',
      bgImage: 'https://images.unsplash.com/photo-1592078615290-0afee58c2ca9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1964&q=80',
      color: 'bg-green-100 text-green-800',
      count: 35
    },
    {
      name: 'Accessories',
      description: 'Complete your look with our unique accessories.',
      bgImage: 'https://images.unsplash.com/photo-1547658719-19c95eadc5df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
      color: 'bg-yellow-100 text-yellow-800',
      count: 15
    }
  ];

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getFeatured();
      if (response.success) {
        setFeaturedProducts(response.data);
      }
    } catch (error: any) {
      console.error('Failed to fetch featured products:', error);
      toast.error('Failed to load featured products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const handleShopNowClick = () => {
    navigate('/products');
  };

  const handleViewCategoriesClick = () => {
    navigate('/products');
  };

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/products?category=${categoryName}`);
  };

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) {
      toast.error('Please enter your email address');
      return;
    }

    setSubscribing(true);
    try {
      const response = await newsletterAPI.subscribe(newsletterEmail);
      if (response.success) {
        toast.success(response.data.message);
        setNewsletterEmail('');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to subscribe');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")'
          }}
        ></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center animate-fade-in">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 animate-scale-in">
              Fashion for Every Rwandan
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover shoes, clothes & accessories that celebrate your style
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={handleShopNowClick}
                className="bg-white text-violet-600 hover:bg-slate-100 px-8 py-3 text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-violet-600 border-t-transparent mr-2"></div>
                    Loading...
                  </div>
                ) : (
                  'Shop Now'
                )}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleViewCategoriesClick}
                className="border-white text-white hover:bg-white hover:text-violet-600 px-8 py-3 text-lg font-semibold transform hover:scale-105 transition-all duration-300"
              >
                View Categories
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-purple-50/30 to-indigo-50/50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Shop by Category
            </h3>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Explore our curated collections designed for the modern Rwandan lifestyle
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Card 
                key={index} 
                onClick={() => handleCategoryClick(category.name)}
                className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border-0 bg-white/80 backdrop-blur-sm overflow-hidden transform hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={category.bgImage} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <Badge className={`${category.color} font-semibold shadow-lg`}>
                      {category.count}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6 relative">
                  <div className="mb-4">
                    <h4 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-violet-600 transition-colors duration-300">
                      {category.name}
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transform transition-all duration-300 group-hover:shadow-lg"
                  >
                    Explore {category.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12 animate-fade-in">
            <div>
              <h3 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Featured Products
              </h3>
              <p className="text-slate-600">Handpicked items just for you</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleShopNowClick}
              className="border-violet-200 text-violet-600 hover:bg-violet-50 font-semibold"
            >
              View All
            </Button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.length > 0 ? featuredProducts.map((product, index) => (
                <Card 
                  key={product._id} 
                  className="group hover:shadow-xl transition-all duration-500 cursor-pointer border-0 bg-white transform hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {product.discount && (
                        <Badge className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse">
                          {product.discount}
                        </Badge>
                      )}
                      {product.isNew && (
                        <Badge className="absolute top-2 left-2 bg-gradient-to-r from-green-500 to-green-600 text-white animate-pulse">
                          New
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white transform hover:scale-110 transition-all duration-300"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-4">
                      <Badge variant="secondary" className="mb-2 bg-violet-100 text-violet-800">
                        {product.category}
                      </Badge>
                      <h4 className="font-semibold mb-2 text-slate-800 group-hover:text-violet-600 transition-colors duration-300">
                        {product.name}
                      </h4>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-slate-600 ml-1">{product.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-slate-800">RWF {product.price.toLocaleString()}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-slate-500 line-through ml-2">
                              RWF {product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <Button size="sm" className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300">
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No featured products available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA Section */}
      <section className="py-20 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h3 className="text-4xl font-bold mb-4 animate-fade-in">Join Our Fashion Community</h3>
          <p className="text-xl mb-8 opacity-90 animate-fade-in" style={{ animationDelay: "200ms" }}>
            Get exclusive deals and be the first to know about new arrivals
          </p>
          <form 
            onSubmit={handleNewsletterSubscribe}
            className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto animate-fade-in" 
            style={{ animationDelay: "400ms" }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
              required
              disabled={subscribing}
            />
            <Button 
              type="submit"
              size="lg" 
              disabled={subscribing}
              className="bg-white text-violet-600 hover:bg-slate-100 px-8 font-semibold transform hover:scale-105 transition-all duration-300"
            >
              {subscribing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-violet-600 border-t-transparent mr-2"></div>
                  Subscribing...
                </div>
              ) : (
                'Subscribe'
              )}
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="animate-fade-in">
              <h4 className="text-lg font-semibold mb-4 bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                RwandaStyle
              </h4>
              <p className="text-slate-300">
                Your trusted fashion destination in Rwanda. Quality products, affordable prices.
              </p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "150ms" }}>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-slate-300">
                <li><Link to="/" className="hover:text-violet-400 transition-colors duration-300">Home</Link></li>
                <li><button onClick={() => handleCategoryClick('Shoes')} className="hover:text-violet-400 transition-colors duration-300">Shoes</button></li>
                <li><button onClick={() => handleCategoryClick('Clothes')} className="hover:text-violet-400 transition-colors duration-300">Clothes</button></li>
                <li><button onClick={() => handleCategoryClick('Accessories')} className="hover:text-violet-400 transition-colors duration-300">Accessories</button></li>
              </ul>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "300ms" }}>
              <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-slate-300">
                <li><Link to="/contact" className="hover:text-violet-400 transition-colors duration-300">Contact Us</Link></li>
                <li><Link to="/shipping" className="hover:text-violet-400 transition-colors duration-300">Shipping Info</Link></li>
                <li><Link to="/returns" className="hover:text-violet-400 transition-colors duration-300">Returns</Link></li>
                <li><Link to="/size-guide" className="hover:text-violet-400 transition-colors duration-300">Size Guide</Link></li>
              </ul>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "450ms" }}>
              <h4 className="text-lg font-semibold mb-4">Payment Methods</h4>
              <p className="text-slate-300 mb-2">We accept:</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600">MTN Mobile Money</Badge>
                <Badge className="bg-gradient-to-r from-red-500 to-red-600">Airtel Money</Badge>
                <Badge className="bg-gradient-to-r from-blue-500 to-blue-600">Visa/MasterCard</Badge>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-300">
            <p>&copy; 2024 RwandaStyle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
