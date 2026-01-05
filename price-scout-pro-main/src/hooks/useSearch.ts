import { useState, useCallback, useRef } from 'react';
import { SearchState, Platform, PlatformState, Product, PLATFORMS } from '@/types/search';

const STATUS_MESSAGES = [
  "Selecting delivery locations…",
  "Scanning live prices…",
  "Comparing discounts…",
  "Finding the best deals…",
  "Verifying stock availability…",
  "Calculating savings…",
];

const MOCK_PRODUCTS: Record<Platform, string[]> = {
  zepto: ['Fresh Milk 1L', 'Organic Eggs 6pcs', 'Whole Wheat Bread', 'Butter 500g'],
  dmart: ['Toned Milk 1L', 'Farm Fresh Eggs 12pcs', 'Multigrain Bread', 'Amul Butter 500g'],
  jiomart: ['Full Cream Milk 1L', 'Country Eggs 6pcs', 'Brown Bread', 'Nutralite Butter 500g'],
  naturesbasket: ['A2 Milk 1L', 'Organic Eggs 12pcs', 'Sourdough Bread', 'Organic Butter 250g'],
  instamart: ['Toned Milk 500ml', 'White Eggs 6pcs', 'White Bread', 'Butter 200g'],
};

function generateMockProducts(platform: Platform, query: string): Product[] {
  const baseProducts = MOCK_PRODUCTS[platform];
  const count = Math.floor(Math.random() * 3) + 2;
  
  return baseProducts.slice(0, count).map((name, index) => {
    const mrp = Math.floor(Math.random() * 200) + 50;
    const discount = Math.floor(Math.random() * 30);
    const price = Math.round(mrp * (1 - discount / 100));
    
    return {
      id: `${platform}-${index}`,
      name: `${query} - ${name}`,
      image: `https://images.unsplash.com/photo-${1550583724 + index}-b4692c3e5f5e?w=200&h=200&fit=crop`,
      price,
      mrp,
      discount,
      url: `https://${platform}.com/product/${index}`,
      platform,
    };
  });
}

export function useSearch() {
  const [state, setState] = useState<SearchState>({
    status: 'idle',
    query: { location: '', product: '', platforms: [] },
    platformStates: [],
    results: [],
    progress: 0,
  });
  
  const [statusMessage, setStatusMessage] = useState(STATUS_MESSAGES[0]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const startSearch = useCallback((location: string, product: string, platforms: Platform[]) => {
    clearTimeouts();
    
    const initialPlatformStates: PlatformState[] = platforms.map(p => ({
      platform: p,
      status: 'queued',
    }));

    setState({
      status: 'loading',
      query: { location, product, platforms },
      platformStates: initialPlatformStates,
      results: [],
      progress: 0,
    });

    // Rotate status messages
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % STATUS_MESSAGES.length;
      setStatusMessage(STATUS_MESSAGES[messageIndex]);
    }, 1500);
    timeoutsRef.current.push(messageInterval as unknown as NodeJS.Timeout);

    // Simulate platform searches with staggered timing
    const platformCount = platforms.length;
    let completedCount = 0;
    let allResults: Product[] = [];

    platforms.forEach((platform, index) => {
      // Start each platform with a delay
      const startDelay = index * 800 + Math.random() * 500;
      
      const startTimeout = setTimeout(() => {
        setState(prev => ({
          ...prev,
          platformStates: prev.platformStates.map(ps =>
            ps.platform === platform ? { ...ps, status: 'in-progress' } : ps
          ),
        }));
      }, startDelay);
      timeoutsRef.current.push(startTimeout);

      // Complete each platform
      const completeDelay = startDelay + 1500 + Math.random() * 2000;
      
      const completeTimeout = setTimeout(() => {
        const shouldFail = Math.random() < 0.1; // 10% chance of failure
        
        if (shouldFail) {
          setState(prev => ({
            ...prev,
            platformStates: prev.platformStates.map(ps =>
              ps.platform === platform ? { ...ps, status: 'failed', error: 'Connection timeout' } : ps
            ),
            progress: Math.round(((completedCount + 1) / platformCount) * 100),
          }));
        } else {
          const products = generateMockProducts(platform, product);
          allResults = [...allResults, ...products];
          
          setState(prev => ({
            ...prev,
            platformStates: prev.platformStates.map(ps =>
              ps.platform === platform ? { ...ps, status: 'completed', productCount: products.length } : ps
            ),
            results: allResults,
            progress: Math.round(((completedCount + 1) / platformCount) * 100),
          }));
        }
        
        completedCount++;
        
        if (completedCount === platformCount) {
          clearInterval(messageInterval);
          setState(prev => ({
            ...prev,
            status: 'completed',
            progress: 100,
          }));
        }
      }, completeDelay);
      timeoutsRef.current.push(completeTimeout);
    });
  }, []);

  const retryPlatform = useCallback((platform: Platform) => {
    setState(prev => ({
      ...prev,
      platformStates: prev.platformStates.map(ps =>
        ps.platform === platform ? { ...ps, status: 'in-progress', error: undefined } : ps
      ),
    }));

    const timeout = setTimeout(() => {
      const products = generateMockProducts(platform, state.query.product);
      
      setState(prev => ({
        ...prev,
        platformStates: prev.platformStates.map(ps =>
          ps.platform === platform ? { ...ps, status: 'completed', productCount: products.length } : ps
        ),
        results: [...prev.results, ...products],
      }));
    }, 1500 + Math.random() * 1000);
    timeoutsRef.current.push(timeout);
  }, [state.query.product]);

  const reset = useCallback(() => {
    clearTimeouts();
    setState({
      status: 'idle',
      query: { location: '', product: '', platforms: [] },
      platformStates: [],
      results: [],
      progress: 0,
    });
    setStatusMessage(STATUS_MESSAGES[0]);
  }, []);

  return {
    state,
    statusMessage,
    startSearch,
    retryPlatform,
    reset,
  };
}
