import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart, ArrowRight } from "lucide-react";
import HeaderWithFeatures from "@/components/HeaderWithFeatures";
import NotificationBanner from "@/components/NotificationBanner";
import ProductModal from "@/components/ProductModal";
import { productsAPI, favoritesAPI } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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
  countInStock: number;
}

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [showAll, setShowAll] = useState(false);

  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getFeatured();
        if (response.success) {
          setFeaturedProducts(response.data);
          // Display first 8 products by default (2 rows x 4 columns)
          setDisplayedProducts(response.data.slice(0, 8));
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to fetch featured products');
      } finally {
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      if (!user) return;
      try {
        const response = await favoritesAPI.get();
        if (response.success) {
          setFavorites(response.data.map((fav: any) => fav._id));
        }
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      }
    };

    fetchFeaturedProducts();
    fetchFavorites();
  }, [user]);

  const handleViewMore = () => {
    if (showAll) {
      setDisplayedProducts(featuredProducts.slice(0, 8));
      setShowAll(false);
    } else {
      setDisplayedProducts(featuredProducts);
      setShowAll(true);
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleToggleFavorite = async (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleAddToCart = async (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await addToCart(productId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <HeaderWithFeatures />
      
      {/* Notifications */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <NotificationBanner />
      </div>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Style That Speaks <span className="text-yellow-300">You</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover the latest trends in fashion from Rwanda and beyond
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-3">
                  Shop Now
                </Button>
              </Link>
              <Link to="/products?category=Shoes">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 text-lg px-8 py-3">
                  View Collections
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Shoes', 'Clothes', 'Accessories'].map((category) => (
              <Link
                key={category}
                to={`/products?category=${category}`}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-purple-400 to-pink-400">
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{category}</h3>
                    <p className="opacity-90">Discover our latest collection</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - 2x4 Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600">Handpicked items just for you</p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayedProducts.map((product) => (
                  <Card 
                    key={product._id} 
                    className="group hover:shadow-xl transition-all duration-500 cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className={`absolute top-2 right-2 bg-white/90 hover:bg-white ${
                            favorites.includes(product._id) ? 'text-red-500' : 'text-gray-500'
                          }`}
                          onClick={(e) => handleToggleFavorite(product._id, e)}
                        >
                          <Heart className={`h-4 w-4 ${favorites.includes(product._id) ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                      <div className="p-4">
                        <Badge variant="secondary" className="mb-2">
                          {product.category}
                        </Badge>
                        <h4 className="font-semibold mb-2 group-hover:text-violet-600 transition-colors">
                          {product.name}
                        </h4>
                        <div className="flex items-center mb-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600 ml-1">
                            {product.rating} ({product.numReviews})
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold">RWF {product.price.toLocaleString()}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through ml-2">
                                RWF {product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-violet-600 hover:bg-violet-700"
                            onClick={(e) => handleAddToCart(product._id, e)}
                            disabled={product.countInStock === 0}
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* View More/Less Button */}
              {featuredProducts.length > 8 && (
                <div className="text-center mt-8">
                  <Button
                    onClick={handleViewMore}
                    variant="outline"
                    className="border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white"
                  >
                    {showAll ? 'View Less' : `View More (${featuredProducts.length - 8} more products)`}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay in Style</h2>
          <p className="text-xl mb-8 opacity-90">
            Subscribe to our newsletter for the latest trends and exclusive offers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
      />
    </div>
  );
};

export default Index;
