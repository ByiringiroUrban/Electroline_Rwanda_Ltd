
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { productsAPI } from '@/lib/api';
import { Search } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductSelect: (product: Product) => void;
  onSearchSubmit: (searchTerm: string) => void;
}

const SearchModal = ({ isOpen, onClose, onProductSelect, onSearchSubmit }: SearchModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchProducts = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await productsAPI.getAll({ search: searchTerm, limit: 10 });
        if (response.success) {
          setSearchResults(response.data.products);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleProductClick = (product: Product) => {
    onProductSelect(product);
    onClose();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearchSubmit(searchTerm.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Search Products</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by name, category, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>
          </form>

          <div className="space-y-2">
            {loading && (
              <p className="text-center text-gray-500">Searching...</p>
            )}
            
            {searchResults.length === 0 && searchTerm.length >= 2 && !loading && (
              <p className="text-center text-gray-500">No products found</p>
            )}

            {searchResults.map((product) => (
              <Card
                key={product._id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleProductClick(product)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                        <span className="font-bold text-violet-600">
                          RWF {product.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
