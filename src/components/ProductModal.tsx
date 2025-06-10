
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { favoritesAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  numReviews: number;
  countInStock: number;
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product._id, quantity);
  };

  const handleToggleFavorite = async () => {
    if (!product || !user) {
      toast.error('Please login to add favorites');
      return;
    }

    try {
      if (isFavorite) {
        await favoritesAPI.remove(product._id);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await favoritesAPI.add(product._id);
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update favorites');
    }
  };

  if (!product) return null;

  // Get all product images (main image + additional images)
  const allImages = [product.image, ...(product.images || [])].filter(Boolean);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="relative">
              {allImages.length > 1 ? (
                <Carousel className="w-full max-w-md mx-auto">
                  <CarouselContent>
                    {allImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="relative">
                          <img
                            src={image}
                            alt={`${product.name} - Image ${index + 1}`}
                            className="w-full h-96 object-cover rounded-lg"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className={`absolute top-2 right-2 ${isFavorite ? 'text-red-500' : 'text-gray-500'}`}
                            onClick={handleToggleFavorite}
                          >
                            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                          </Button>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              ) : (
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`absolute top-2 right-2 ${isFavorite ? 'text-red-500' : 'text-gray-500'}`}
                    onClick={handleToggleFavorite}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Badge variant="secondary">{product.category}</Badge>
            
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">
                {product.rating} ({product.numReviews} reviews)
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">RWF {product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    RWF {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            <p className="text-gray-600">{product.description}</p>

            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Stock:</span> {product.countInStock} available
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label htmlFor="quantity" className="text-sm font-medium">Quantity:</label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border rounded px-2 py-1"
                >
                  {[...Array(Math.min(10, product.countInStock))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className="w-full bg-violet-600 hover:bg-violet-700"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
