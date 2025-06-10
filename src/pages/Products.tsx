
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Heart, Search, Filter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { productsAPI, favoritesAPI } from "@/lib/api";
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

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Shoes', label: 'Shoes' },
    { value: 'Clothes', label: 'Clothes' },
    { value: 'Accessories', label: 'Accessories' }
  ];

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 12,
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      // Properly handle category filtering
      if (selectedCategory && selectedCategory !== 'all') {
        params.category = selectedCategory;
      }

      console.log('Fetching products with params:', params);
      const response = await productsAPI.getAll(params);
      
      if (response.success) {
        setProducts(response.data.products);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
        setHasNext(response.data.pagination.hasNext);
        setHasPrev(response.data.pagination.hasPrev);
      }
    } catch (error: any) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
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

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
    setSearchParams(params);
  }, [searchTerm, selectedCategory, setSearchParams]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts(1);
  }, [searchTerm, selectedCategory]);

  // Initialize from URL params and fetch data
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    const searchFromUrl = searchParams.get('search');
    
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
    
    fetchFavorites();
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProducts(page);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            {selectedCategory === 'all' ? 'All Products' : selectedCategory}
          </h1>
          <p className="text-center text-slate-600">
            Discover our amazing collection of {selectedCategory === 'all' ? 'products' : selectedCategory.toLowerCase()}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product._id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {product.discount && (
                        <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                          {product.discount}
                        </Badge>
                      )}
                      {product.isNew && (
                        <Badge className="absolute top-2 left-2 bg-green-500 text-white">
                          New
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleFavorite(product._id)}
                        className={`absolute top-2 right-2 ${
                          favorites.includes(product._id)
                            ? 'bg-red-100 text-red-500 hover:bg-red-200'
                            : 'bg-white/90 hover:bg-white'
                        }`}
                      >
                        <Heart 
                          className={`h-4 w-4 ${
                            favorites.includes(product._id) ? 'fill-current' : ''
                          }`} 
                        />
                      </Button>
                    </div>
                    <div className="p-4">
                      <Badge variant="secondary" className="mb-2">
                        {product.category}
                      </Badge>
                      <h4 className="font-semibold mb-2">{product.name}</h4>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-slate-600 ml-1">{product.rating}</span>
                          <span className="text-sm text-slate-500 ml-1">({product.numReviews})</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold">RWF {product.price.toLocaleString()}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-slate-500 line-through ml-2">
                              RWF {product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!hasPrev}
                >
                  Previous
                </Button>
                
                <div className="flex space-x-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={currentPage === page ? "bg-violet-600 hover:bg-violet-700" : ""}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasNext}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No products found</h3>
            <p className="text-slate-500">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your filters or search terms'
                : 'No products available at the moment'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
