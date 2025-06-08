
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, User, Menu, Star, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const featuredProducts = [
    {
      id: 1,
      name: "Classic Leather Boots",
      price: "RWF 45,000",
      originalPrice: "RWF 55,000",
      image: "/api/placeholder/300/300",
      category: "Shoes",
      rating: 4.8,
      discount: "18% OFF"
    },
    {
      id: 2,
      name: "Traditional Kitenge Dress",
      price: "RWF 25,000",
      image: "/api/placeholder/300/300",
      category: "Clothes",
      rating: 4.9,
      isNew: true
    },
    {
      id: 3,
      name: "Handcrafted Necklace",
      price: "RWF 12,000",
      image: "/api/placeholder/300/300",
      category: "Accessories",
      rating: 4.7
    },
    {
      id: 4,
      name: "Modern Ankara Shirt",
      price: "RWF 18,000",
      image: "/api/placeholder/300/300",
      category: "Clothes",
      rating: 4.6
    }
  ];

  const categories = [
    { name: "Shoes", count: "120+ items", color: "bg-orange-100 text-orange-800" },
    { name: "Clothes", count: "250+ items", color: "bg-blue-100 text-blue-800" },
    { name: "Accessories", count: "80+ items", color: "bg-green-100 text-green-800" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                Rwanda Fashion Hub
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-orange-600 transition-colors">Home</Link>
              <Link to="/shoes" className="text-gray-700 hover:text-orange-600 transition-colors">Shoes</Link>
              <Link to="/clothes" className="text-gray-700 hover:text-orange-600 transition-colors">Clothes</Link>
              <Link to="/accessories" className="text-gray-700 hover:text-orange-600 transition-colors">Accessories</Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search for shoes, clothes, accessories..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Heart className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-orange-500">
                  2
                </Badge>
              </Button>
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-orange-500">
                  3
                </Badge>
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <nav className="flex flex-col space-y-2">
                  <Link to="/" className="text-gray-700 hover:text-orange-600 py-2">Home</Link>
                  <Link to="/shoes" className="text-gray-700 hover:text-orange-600 py-2">Shoes</Link>
                  <Link to="/clothes" className="text-gray-700 hover:text-orange-600 py-2">Clothes</Link>
                  <Link to="/accessories" className="text-gray-700 hover:text-orange-600 py-2">Accessories</Link>
                </nav>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Fashion for Every Rwandan
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover shoes, clothes & accessories that celebrate your style
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg">
                Shop Now
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 text-lg">
                View Categories
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Shop by Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-100 to-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-500 rounded-full"></div>
                  </div>
                  <h4 className="text-xl font-semibold mb-2">{category.name}</h4>
                  <Badge className={category.color}>{category.count}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800">Featured Products</h3>
            <Button variant="outline">View All</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow group cursor-pointer">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform"
                    />
                    {product.discount && (
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        {product.discount}
                      </Badge>
                    )}
                    {product.isNew && (
                      <Badge className="absolute top-2 left-2 bg-green-500">
                        New
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <Badge variant="secondary" className="mb-2">
                      {product.category}
                    </Badge>
                    <h4 className="font-semibold mb-2 text-gray-800">{product.name}</h4>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-gray-800">{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">Join Our Fashion Community</h3>
          <p className="text-xl mb-8 opacity-90">
            Get exclusive deals and be the first to know about new arrivals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Rwanda Fashion Hub</h4>
              <p className="text-gray-300">
                Your trusted fashion destination in Rwanda. Quality products, affordable prices.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/shoes" className="hover:text-white">Shoes</Link></li>
                <li><Link to="/clothes" className="hover:text-white">Clothes</Link></li>
                <li><Link to="/accessories" className="hover:text-white">Accessories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link to="/shipping" className="hover:text-white">Shipping Info</Link></li>
                <li><Link to="/returns" className="hover:text-white">Returns</Link></li>
                <li><Link to="/size-guide" className="hover:text-white">Size Guide</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Payment Methods</h4>
              <p className="text-gray-300 mb-2">We accept:</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-yellow-600">MTN Mobile Money</Badge>
                <Badge className="bg-red-600">Airtel Money</Badge>
                <Badge className="bg-blue-600">Visa/MasterCard</Badge>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Rwanda Fashion Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
