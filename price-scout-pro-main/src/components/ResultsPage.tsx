import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Award, Package, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product, PLATFORMS, Platform } from '@/types/search';

interface ResultsPageProps {
  product: string;
  location: string;
  results: Product[];
  onBack: () => void;
}

export function ResultsPage({ product, location, results, onBack }: ResultsPageProps) {
  // Find the best price
  const lowestPrice = Math.min(...results.map(p => p.price));
  
  // Group results by platform
  const groupedResults = PLATFORMS.reduce((acc, platform) => {
    const platformProducts = results.filter(p => p.platform === platform.id);
    if (platformProducts.length > 0) {
      acc[platform.id] = platformProducts;
    }
    return acc;
  }, {} as Record<Platform, Product[]>);

  return (
    <div className="min-h-screen px-4 py-8 relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 hover:bg-primary/10 hover:text-primary -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Search
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Results for <span className="text-gradient">"{product}"</span>
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
                <span className="mx-2">•</span>
                <Package className="w-4 h-4" />
                <span>{results.length} products found</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/20 rounded-lg">
              <Award className="w-5 h-5 text-success" />
              <span className="text-success font-medium">Best price: ₹{lowestPrice}</span>
            </div>
          </div>
        </motion.div>

        {/* Results Grid */}
        <div className="space-y-8">
          {Object.entries(groupedResults).map(([platformId, products], platformIndex) => {
            const platformInfo = PLATFORMS.find(p => p.id === platformId);
            
            return (
              <motion.div
                key={platformId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: platformIndex * 0.1, duration: 0.5 }}
              >
                {/* Platform Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-3 h-3 rounded-full bg-${platformInfo?.color}`} />
                  <h2 className="text-xl font-semibold">{platformInfo?.name}</h2>
                  <span className="text-sm text-muted-foreground">
                    {products.length} product{products.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product, productIndex) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isBestPrice={product.price === lowestPrice}
                      delay={platformIndex * 0.1 + productIndex * 0.05}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  isBestPrice: boolean;
  delay: number;
}

function ProductCard({ product, isBestPrice, delay }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      className={`
        relative p-4 rounded-xl border bg-card transition-all duration-300
        hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5
        ${isBestPrice ? 'border-success/30 bg-success/5' : 'border-border/50'}
      `}
    >
      {/* Best Price Badge */}
      {isBestPrice && (
        <div className="absolute -top-2 -right-2 px-2 py-1 bg-success text-success-foreground text-xs font-semibold rounded-md flex items-center gap-1">
          <Award className="w-3 h-3" />
          Best Price
        </div>
      )}

      <div className="flex gap-4">
        {/* Product Image */}
        <div className="w-20 h-20 rounded-lg bg-secondary flex-shrink-0 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop';
            }}
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm leading-tight mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-xl font-bold">₹{product.price}</span>
            {product.discount > 0 && (
              <>
                <span className="text-sm text-muted-foreground line-through">₹{product.mrp}</span>
                <span className="text-xs text-success font-medium">{product.discount}% off</span>
              </>
            )}
          </div>

          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            View Product
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
