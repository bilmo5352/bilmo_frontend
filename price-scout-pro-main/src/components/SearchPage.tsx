import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Platform, PLATFORMS } from '@/types/search';

interface SearchPageProps {
  onSearch: (location: string, product: string, platforms: Platform[]) => void;
}

export function SearchPage({ onSearch }: SearchPageProps) {
  const [location, setLocation] = useState('');
  const [product, setProduct] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([
    'zepto', 'dmart', 'jiomart', 'naturesbasket', 'instamart'
  ]);

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location && product && selectedPlatforms.length > 0) {
      onSearch(location, product, selectedPlatforms);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl relative z-10"
      >
        {/* Logo/Title */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center glow">
              <ShoppingCart className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-gradient">PriceHunt</h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-muted-foreground text-lg"
          >
            Compare grocery prices across platforms instantly
          </motion.p>
        </div>

        {/* Search Form */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Location Input */}
          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Enter your location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-12 h-14 text-lg bg-card border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Product Input */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="What are you looking for?"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="pl-12 h-14 text-lg bg-card border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Platform Selection */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground font-medium">Compare prices on</p>
            <div className="flex flex-wrap gap-3">
              {PLATFORMS.map((platform, index) => (
                <motion.label
                  key={platform.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer
                    border transition-all duration-200
                    ${selectedPlatforms.includes(platform.id)
                      ? 'bg-primary/10 border-primary/30'
                      : 'bg-card border-border/50 hover:border-border'
                    }
                  `}
                >
                  <Checkbox
                    checked={selectedPlatforms.includes(platform.id)}
                    onCheckedChange={() => togglePlatform(platform.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="text-sm font-medium">{platform.name}</span>
                </motion.label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <Button
              type="submit"
              size="lg"
              disabled={!location || !product || selectedPlatforms.length === 0}
              className="w-full h-14 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 glow disabled:opacity-50 disabled:glow-none transition-all"
            >
              <Search className="w-5 h-5 mr-2" />
              Search Prices
            </Button>
          </motion.div>
        </motion.form>

        {/* Footer hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          Comparing prices from 5 platforms in real-time
        </motion.p>
      </motion.div>
    </div>
  );
}
