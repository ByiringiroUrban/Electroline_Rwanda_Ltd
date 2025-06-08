
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ShoppingCart, User, Menu, Star, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({});

  const handleImageLoad = (id) => {
    setImagesLoaded(prev => ({ ...prev, [id]: true }));
  };

  const featuredProducts = [
    {
      id: 1,
      name: "Classic Leather Boots",
      price: "RWF 45,000",
      originalPrice: "RWF 55,000",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "Shoes",
      rating: 4.8,
      discount: "18% OFF"
    },
    {
      id: 2,
      name: "Traditional Kitenge Dress",
      price: "RWF 25,000",
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "Clothes",
      rating: 4.9,
      isNew: true
    },
    {
      id: 3,
      name: "Handcrafted Necklace",
      price: "RWF 12,000",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "Accessories",
      rating: 4.7
    },
    {
      id: 4,
      name: "Modern Ankara Shirt",
      price: "RWF 18,000",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "Clothes",
      rating: 4.6
    }
  ];

  const categories = [
    { 
      name: "Shoes", 
      count: "120+ items", 
      color: "bg-gradient-to-br from-purple-100 to-purple-200 text-purple-800",
      bgImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "Step into style with our premium collection"
    },
    { 
      name: "Clothes", 
      count: "250+ items", 
      color: "bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-800",
      bgImage: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "Fashion that speaks your language"
    },
    { 
      name: "Accessories", 
      count: "80+ items", 
      color: "bg-gradient-to-br from-rose-100 to-rose-200 text-rose-800",
      bgImage: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      description: "Complete your look with perfect accessories"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Header />

      {/* Hero Section with Shoe Background */}
      <section className="relative text-white py-32 overflow-hidden min-h-[600px]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")`
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/80 via-purple-900/70 to-indigo-900/80"></div>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex items-center">
          <div className="text-center w-full animate-hero-entrance">
            <div className="animate-bounce-gentle mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-6 animate-pulse-slow">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 10.87V12h2v15.87c5.16-1.13 9-5.32 9-10.87V7L12 2z"/>
                </svg>
              </div>
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-8 animate-slide-up bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent leading-tight">
              Fashion for Every Rwandan
            </h2>
            <p className="text-2xl md:text-3xl mb-12 opacity-95 animate-fade-in-delay font-light max-w-4xl mx-auto leading-relaxed">
              Discover shoes, clothes & accessories that celebrate your unique style and heritage
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-float-up">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-white to-purple-50 text-violet-700 hover:from-purple-50 hover:to-white px-12 py-4 text-xl font-bold transform hover:scale-110 hover:rotate-1 transition-all duration-500 shadow-2xl border-2 border-white/20 animate-glow"
                onClick={() => setIsLoading(true)}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-violet-600 border-t-transparent mr-2"></div>
                    Loading...
                  </div>
                ) : (
                  "Shop Now"
                )}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-violet-700 px-12 py-4 text-xl font-bold transform hover:scale-110 hover:-rotate-1 transition-all duration-500 shadow-2xl backdrop-blur-sm bg-white/10"
              >
                View Categories
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-scroll"></div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-purple-50/30 to-indigo-50/50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 animate-fade-in">
            <h3 className="text-5xl font-black mb-6 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
              Shop by Category
            </h3>
            <p className="text-slate-600 text-xl max-w-3xl mx-auto leading-relaxed">
              Explore our curated collections designed for the modern Rwandan lifestyle
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {categories.map((category, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-3xl transition-all duration-700 cursor-pointer border-0 bg-white/90 backdrop-blur-lg overflow-hidden transform hover:-translate-y-4 hover:rotate-1 animate-stagger-in relative"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={category.bgImage} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-125 group-hover:rotate-3"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/60 transition-all duration-500"></div>
                  <div className="absolute top-6 right-6 transform group-hover:scale-110 transition-transform duration-300">
                    <Badge className={`${category.color} font-bold shadow-xl text-sm px-4 py-2 animate-pulse-soft`}>
                      {category.count}
                    </Badge>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h4 className="text-3xl font-black text-white mb-3 group-hover:text-purple-200 transition-colors duration-300 transform group-hover:scale-105">
                      {category.name}
                    </h4>
                  </div>
                </div>
                <CardContent className="p-8 relative">
                  <p className="text-slate-600 text-base leading-relaxed mb-6">
                    {category.description}
                  </p>
                  <Button 
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transform transition-all duration-500 group-hover:shadow-2xl group-hover:scale-105 animate-shimmer"
                  >
                    Explore {category.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products with Real Images */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50L25 25M50 50L75 25M50 50L25 75M50 50L75 75' stroke='%23violet' stroke-width='1' fill='none'/%3E%3C/svg%3E")`
        }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center mb-16 animate-fade-in">
            <div>
              <h3 className="text-5xl font-black bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4 animate-gradient">
                Featured Products
              </h3>
              <p className="text-slate-600 text-xl">Handpicked items just for you</p>
            </div>
            <Button 
              variant="outline" 
              className="border-2 border-violet-200 text-violet-600 hover:bg-violet-50 font-bold px-8 py-3 text-lg transform hover:scale-105 transition-all duration-300"
            >
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <Card 
                key={product.id} 
                className="group hover:shadow-3xl transition-all duration-700 cursor-pointer border-0 bg-white transform hover:-translate-y-2 hover:rotate-1 animate-stagger-in overflow-hidden relative"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-0 relative">
                  <div className="relative overflow-hidden h-64">
                    {!imagesLoaded[product.id] && (
                      <Skeleton className="w-full h-full absolute inset-0 z-10" />
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                      onLoad={() => handleImageLoad(product.id)}
                      style={{ opacity: imagesLoaded[product.id] ? 1 : 0 }}
                    />
                    {product.discount && (
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white animate-bounce-gentle font-bold px-3 py-1">
                        {product.discount}
                      </Badge>
                    )}
                    {product.isNew && (
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-600 text-white animate-bounce-gentle font-bold px-3 py-1">
                        New
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-3 right-3 bg-white/90 hover:bg-white transform hover:scale-125 transition-all duration-300 rounded-full w-10 h-10 p-0 animate-float"
                    >
                      <Heart className="h-4 w-4 group-hover:text-red-500 transition-colors duration-300" />
                    </Button>
                  </div>
                  <div className="p-6">
                    <Badge variant="secondary" className="mb-3 bg-violet-100 text-violet-800 font-semibold px-3 py-1">
                      {product.category}
                    </Badge>
                    <h4 className="font-bold mb-3 text-slate-800 group-hover:text-violet-600 transition-colors duration-300 text-lg leading-tight">
                      {product.name}
                    </h4>
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-slate-600 ml-1 font-medium">{product.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-black text-slate-800">{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-slate-500 line-through ml-2">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 transform hover:scale-110 transition-all duration-300 font-bold px-4 py-2 animate-glow"
                      >
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
      <section className="py-24 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h3 className="text-5xl font-black mb-6 animate-fade-in">Join Our Fashion Community</h3>
          <p className="text-2xl mb-12 opacity-95 animate-fade-in font-light max-w-3xl mx-auto" style={{ animationDelay: "200ms" }}>
            Get exclusive deals and be the first to know about new arrivals
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-lg mx-auto animate-float-up" style={{ animationDelay: "400ms" }}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all duration-300 font-medium text-lg"
            />
            <Button 
              size="lg" 
              className="bg-white text-violet-600 hover:bg-purple-50 px-10 font-bold transform hover:scale-105 transition-all duration-300 text-lg py-4 rounded-xl shadow-xl"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="animate-fade-in">
              <h4 className="text-2xl font-black mb-6 bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                RwandaStyle
              </h4>
              <p className="text-slate-300 leading-relaxed text-lg">
                Your trusted fashion destination in Rwanda. Quality products, affordable prices, authentic style.
              </p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "150ms" }}>
              <h4 className="text-xl font-bold mb-6">Quick Links</h4>
              <ul className="space-y-3 text-slate-300">
                <li><Link to="/" className="hover:text-violet-400 transition-colors duration-300 text-lg">Home</Link></li>
                <li><Link to="/shoes" className="hover:text-violet-400 transition-colors duration-300 text-lg">Shoes</Link></li>
                <li><Link to="/clothes" className="hover:text-violet-400 transition-colors duration-300 text-lg">Clothes</Link></li>
                <li><Link to="/accessories" className="hover:text-violet-400 transition-colors duration-300 text-lg">Accessories</Link></li>
              </ul>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "300ms" }}>
              <h4 className="text-xl font-bold mb-6">Customer Service</h4>
              <ul className="space-y-3 text-slate-300">
                <li><Link to="/contact" className="hover:text-violet-400 transition-colors duration-300 text-lg">Contact Us</Link></li>
                <li><Link to="/shipping" className="hover:text-violet-400 transition-colors duration-300 text-lg">Shipping Info</Link></li>
                <li><Link to="/returns" className="hover:text-violet-400 transition-colors duration-300 text-lg">Returns</Link></li>
                <li><Link to="/size-guide" className="hover:text-violet-400 transition-colors duration-300 text-lg">Size Guide</Link></li>
              </ul>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "450ms" }}>
              <h4 className="text-xl font-bold mb-6">Payment Methods</h4>
              <p className="text-slate-300 mb-4 text-lg">We accept:</p>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-lg px-4 py-2">MTN Mobile Money</Badge>
                <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-lg px-4 py-2">Airtel Money</Badge>
                <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-lg px-4 py-2">Visa/MasterCard</Badge>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-300">
            <p className="text-lg">&copy; 2024 RwandaStyle. All rights reserved. Made with ❤️ in Rwanda</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
