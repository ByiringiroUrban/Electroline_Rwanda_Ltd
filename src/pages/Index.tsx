import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart } from "lucide-react";
import cctvSecurityImg from "@/assets/cctv-security.jpg";
import electricalServicesImg from "@/assets/electrical-services.jpg";
import networkingTelecomImg from "@/assets/networking-telecom.jpg";
import itServicesImg from "@/assets/it-services.jpg";
import electronicComponentsImg from "@/assets/electronic-components.jpg";
import electronicsHeroImg from "@/assets/electronics-hero.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { productsAPI, newsletterAPI, favoritesAPI, categoriesAPI } from "@/lib/api";
import { toast } from "sonner";
import Header from "@/components/Header";

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
  rating: number;
  numReviews: number;
  featured: boolean;
  isNew: boolean;
  discount?: string;
  countInStock: number;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  color: string;
  isActive: boolean;
  count?: number;
}

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching featured products...');
      const response = await productsAPI.getFeatured();
      console.log('Featured products response:', response);
      
      if (response.success && Array.isArray(response.data) && response.data.length > 0) {
        console.log('Featured products data:', response.data);
        setFeaturedProducts(response.data);
      } else {
        console.warn('Featured endpoint returned empty. Falling back to all products and filtering by featured flag.');
        const allRes = await productsAPI.getAll({ limit: 100 });
        if (allRes.success && allRes.data && Array.isArray(allRes.data.products)) {
          const featured = allRes.data.products.filter((p: any) => p.featured === true);
          if (featured.length > 0) {
            setFeaturedProducts(featured);
          } else {
            console.warn('No featured products found in catalog. Showing latest products instead.');
            setFeaturedProducts(allRes.data.products);
          }
        } else {
          setFeaturedProducts([]);
        }
      }
    } catch (error: any) {
      console.error('Failed to fetch featured products:', error);
      // As a resilient fallback, try to show latest products so the grid is never empty
      try {
        const allRes = await productsAPI.getAll({ limit: 100 });
        if (allRes.success && allRes.data && Array.isArray(allRes.data.products)) {
          setFeaturedProducts(allRes.data.products);
        } else {
          setFeaturedProducts([]);
        }
      } catch {
        setFeaturedProducts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!user) {
      setFavorites([]);
      return;
    }
    
    try {
      const response = await favoritesAPI.get();
      if (response.success) {
        const favoriteIds = response.data.map((fav: any) => fav._id || fav);
        setFavorites(favoriteIds);
      }
    } catch (error: any) {
      console.error('Failed to fetch favorites:', error);
      setFavorites([]);
    }
  };

  const toggleFavorite = async (productId: string) => {
    if (!user) {
      toast.error('Please login to add favorites');
      return;
    }

    try {
      if (favorites.includes(productId)) {
        await favoritesAPI.remove(productId);
        setFavorites(prev => prev.filter(id => id !== productId));
        toast.success('Removed from favorites');
      } else {
        await favoritesAPI.add(productId);
        setFavorites(prev => [...prev, productId]);
        toast.success('Added to favorites');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update favorites');
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    if (product.countInStock === 0) {
      toast.error('Product is out of stock');
      return;
    }

    await addToCart(product._id, 1);
  };

  const fetchCategoryData = async () => {
    try {
      console.log('Fetching categories...');
      const categoriesRes = await categoriesAPI.getAll();
      
      if (categoriesRes.success && Array.isArray(categoriesRes.data)) {
        // Get product counts for each category
        const categoriesWithCounts = await Promise.all(
          categoriesRes.data.map(async (category: Category) => {
            try {
              const productsRes = await productsAPI.getAll({ category: category.name, limit: 1 });
              return {
                ...category,
                count: productsRes.success ? productsRes.data.pagination.totalProducts : 0,
                bgImage: category.image || electronicComponentsImg
              };
            } catch (error) {
              console.error(`Error fetching products for category ${category.name}:`, error);
              return {
                ...category,
                count: 0,
                bgImage: category.image || electronicComponentsImg
              };
            }
          })
        );
        
        setCategories(categoriesWithCounts.slice(0, 3)); // Show first 3 on homepage
      } else {
        console.warn('No categories found, using empty array');
        setCategories([]);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCategoryData();
    fetchFavorites();
  }, [user]);

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
        toast.success(response.data.message || 'Successfully subscribed to our newsletter!');
        setNewsletterEmail('');
        
        // Simulate sending email notification to your email
        console.log(`Newsletter subscription notification sent to: getwayconnection@gmail.com`);
        console.log(`New subscriber: ${newsletterEmail}`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to subscribe. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary via-blue-600 to-blue-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url("${electronicsHeroImg}")`
          }}
        ></div>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center animate-fade-in">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 animate-scale-in">
              Electronics & Technical Solutions
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Professional electronic equipment, security systems & technical services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={handleShopNowClick}
                className="bg-white text-primary hover:bg-slate-100 px-8 py-3 text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg"
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
                className="border-white text-primary hover:bg-white hover:text-primary px-8 py-3 text-lg font-semibold transform hover:scale-105 transition-all duration-300"
              >
                View Categories
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-slate-50/30 to-blue-50/50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Shop by Category
            </h3>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Professional electronics, security systems, and technical services
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
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = electronicComponentsImg;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <Badge className={`${category.color} font-semibold shadow-lg`}>
                      {category.count || 0} items
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6 relative">
                  <div className="mb-4">
                    <h4 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors duration-300">
                      {category.name}
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transform transition-all duration-300 group-hover:shadow-lg"
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
              <h3 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
                Featured Products
              </h3>
              <p className="text-slate-600">Handpicked items just for you</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleShopNowClick}
              className="border-blue-200 text-primary hover:bg-blue-50 font-semibold transform hover:scale-105 transition-all duration-300"
            >
              View All
            </Button>
          </div>
          
           {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              {(() => {
                const indexOfLastProduct = currentPage * productsPerPage;
                const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
                const currentProducts = featuredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
                const totalPages = Math.ceil(featuredProducts.length / productsPerPage);

                return (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {currentProducts.map((product, index) => (
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
                                onError={(e) => {
                                  console.error('Image failed to load:', product.image);
                                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                                }}
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(product._id);
                                }}
                                className={`absolute top-2 right-2 ${
                                  favorites.includes(product._id)
                                    ? 'bg-red-100 text-red-500 hover:bg-red-200'
                                    : 'bg-white/90 hover:bg-white'
                                } transform hover:scale-110 transition-all duration-300`}
                              >
                                <Heart 
                                  className={`h-4 w-4 ${
                                    favorites.includes(product._id) ? 'fill-current' : ''
                                  }`} 
                                />
                              </Button>
                            </div>
                            <div className="p-4">
                              <Badge variant="secondary" className="mb-2 bg-violet-100 text-violet-800">
                                {product.category?.name || 'Unknown'}
                              </Badge>
                              <h4 className="font-semibold mb-2 text-slate-800 group-hover:text-violet-600 transition-colors duration-300">
                                {product.name}
                              </h4>
                              <div className="flex items-center mb-2">
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm text-slate-600 ml-1">{product.rating || 4.5}</span>
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
                                <Button 
                                  size="sm" 
                                  className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(product);
                                  }}
                                  disabled={product.countInStock === 0}
                                >
                                  {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center space-x-2 mt-8">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-4 py-2"
                        >
                          Previous
                        </Button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            onClick={() => setCurrentPage(page)}
                            className="px-3 py-2 min-w-[40px]"
                          >
                            {page}
                          </Button>
                        ))}
                        
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2"
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                );
              })()}
            </>
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <Heart className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">No Featured Products Available</h3>
                <p className="text-slate-500 mb-4">Check back later for exciting featured products!</p>
                <Button 
                  onClick={handleShopNowClick}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                >
                  Browse All Products
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA Section */}
      <section className="py-20 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }}></div>
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
              <h4 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Electroline Rwanda Ltd.
              </h4>
              <p className="text-slate-300">
                Your trusted electronics and technical solutions provider in Rwanda. Quality products, professional services.
              </p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "150ms" }}>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-slate-300">
                <li><Link to="/" className="hover:text-violet-400 transition-colors duration-300">Home</Link></li>
                <li><button onClick={() => handleCategoryClick('CCTV Cameras & Security Systems')} className="hover:text-violet-400 transition-colors duration-300">CCTV & Security</button></li>
                <li><button onClick={() => handleCategoryClick('Electrical Installations & Maintenance')} className="hover:text-violet-400 transition-colors duration-300">Electrical Services</button></li>
                <li><button onClick={() => handleCategoryClick('Networking & Telecommunications')} className="hover:text-violet-400 transition-colors duration-300">Networking</button></li>
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
            <p>&copy; 2024 Electroline Rwanda Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
