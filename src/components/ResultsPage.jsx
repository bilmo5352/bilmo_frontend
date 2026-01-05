import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  ArrowLeft,
  Bot,
  User,
  ShoppingBag,
  Loader2,
  ChevronDown,
  Heart,
  Wallet,
  Sparkles,
  Store,
} from 'lucide-react';
import { scrapeOnPlatform } from '../utils/platformScraper';

const ResultsPage = ({ query, onBack }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'user',
      text: query,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStores] = useState(['zepto', 'instamart', 'dmart']);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([
    'dmart',
    'jiomart',
    'naturesbasket',
    'zepto',
    'swiggy',
  ]);
  const [selectedMode, setSelectedMode] = useState('default');
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);

  // scraping state per product+platform
  const [platformResults, setPlatformResults] = useState({});
  // to avoid re-triggering scrapes for same product
  const scrapedProductsRef = useRef(new Set());

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const modeDropdownRef = useRef(null);
  const processedQueryRef = useRef('');

  const modes = [
    { id: 'default', name: 'Default', icon: Sparkles },
    { id: 'health', name: 'Health', icon: Heart },
    { id: 'budget', name: 'Budget', icon: Wallet },
  ];

  const stores = [
    {
      id: 'dmart',
      name: 'DMart',
      color: 'from-yellow-500 to-yellow-600',
      logo:
        'https://ik.imagekit.io/varsh0506/Bilmo/images_q=tbn:ANd9GcRW3ocWi2huAaETIiB53Z7cNqG5-q6eJ6pr2Q&s',
    },
    {
      id: 'jiomart',
      name: 'JioMart',
      color: 'from-blue-500 to-blue-600',
      logo: 'https://ik.imagekit.io/varsh0506/Bilmo/JioMart_logo.svg.png',
    },
    {
      id: 'naturesbasket',
      name: 'NaturesBasket',
      color: 'from-emerald-500 to-emerald-600',
      logo: 'https://ik.imagekit.io/varsh0506/Bilmo/phpyRhVZY_bxgoqa.jpg',
    },
    {
      id: 'zepto',
      name: 'Zepto',
      color: 'from-purple-500 to-purple-600',
      logo: 'https://ik.imagekit.io/varsh0506/Bilmo/84562117_s=280&v=4',
    },
    {
      id: 'swiggy',
      name: 'Swiggy',
      color: 'from-orange-500 to-orange-600',
      logo: 'https://ik.imagekit.io/varsh0506/Bilmo/instamart_20logo.jpg',
    },
  ];

  const mapProductsFromResponse = (productsArray = []) => {
    return productsArray.map((p, idx) => {
      const name = p.product || p.name || `Product ${idx + 1}`;
      const store = stores[idx % stores.length].id;
      const price = p.price || `₹${199 + idx * 50}`;
      return {
        id: `${Date.now()}-${idx}`,
        name,
        price,
        store,
        image: p.image || null,
      };
    });
  };

  const initiateProductScraping = (productName, productId) => {
    if (scrapedProductsRef.current.has(productId)) return;
    scrapedProductsRef.current.add(productId);

    const PLATFORMS = ['dmart', 'jiomart', 'naturesbasket', 'zepto', 'swiggy'];

    PLATFORMS.forEach((platform) => {
      setPlatformResults((prev) => ({
        ...prev,
        [`${productId}-${platform}`]: { status: 'loading', products: [] },
      }));

      (async () => {
        const result = await scrapeOnPlatform(platform, productName);
        setPlatformResults((prev) => ({
          ...prev,
          [`${productId}-${platform}`]: result,
        }));
      })();
    });
  };

  const callLLMAPI = async (userQuery, mode) => {
    try {
      const response = await fetch(
        'https://bilmollm-production.up.railway.app/chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'user',
                content: userQuery,
              },
            ],
            mode: mode,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      let summary = '';
      let productsList = [];

      try {
        const parsedAssistant = JSON.parse(data.assistant);
        summary = parsedAssistant.summary || data.assistant;
        productsList = mapProductsFromResponse(parsedAssistant.products);
      } catch (e) {
        summary = data.assistant;
      }

      return { summary, productsList, error: null };
    } catch (error) {
      console.error('API call error:', error);
      return { summary: null, productsList: [], error: error.message };
    }
  };

  // initial query
  useEffect(() => {
    if (query && processedQueryRef.current !== query) {
      processedQueryRef.current = query;
      setIsLoading(true);

      callLLMAPI(query, selectedMode).then(
        ({ summary, productsList, error }) => {
          setIsLoading(false);

          if (error) {
            setMessages((prev) => [
              ...prev,
              {
                id: 2,
                type: 'assistant',
                text: `Sorry, I encountered an error: ${error}. Please try again.`,
                timestamp: new Date(),
              },
            ]);
          } else {
            if (summary) {
              setMessages((prev) => [
                ...prev,
                {
                  id: 2,
                  type: 'assistant',
                  text: summary,
                  timestamp: new Date(),
                },
              ]);
            }
            const nextProducts = productsList || [];
            setProducts(nextProducts);

            nextProducts.forEach((product) => {
              initiateProductScraping(product.name, product.id);
            });

            if (nextProducts.length > 0) {
              setSelectedProductId(nextProducts[0].id);
            }
          }
        },
      );
    }
  }, [query, selectedMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modeDropdownRef.current &&
        !modeDropdownRef.current.contains(event.target)
      ) {
        setIsModeDropdownOpen(false);
      }
    };
    if (isModeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModeDropdownOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userQuery = inputValue.trim();
    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      text: userQuery,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);

    const { summary, productsList, error } = await callLLMAPI(
      userQuery,
      selectedMode,
    );
    setIsLoading(false);

    if (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 2,
          type: 'assistant',
          text: `Sorry, I encountered an error: ${error}. Please try again.`,
          timestamp: new Date(),
        },
      ]);
    } else {
      if (summary) {
        setMessages((prev) => [
          ...prev,
          {
            id: messages.length + 2,
            type: 'assistant',
            text: summary,
            timestamp: new Date(),
          },
        ]);
      }
      const nextProducts = productsList || [];
      setProducts(nextProducts);

      nextProducts.forEach((product) => {
        initiateProductScraping(product.name, product.id);
      });

      if (nextProducts.length > 0) {
        setSelectedProductId(nextProducts[0].id);
      }
    }
  };

  const togglePlatform = (platformId) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId],
    );
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const platformResultsData = selectedPlatforms.map((platformId) => {
    const storeInfo = stores.find((s) => s.id === platformId);
    const scrapeState =
      platformResults[`${selectedProductId}-${platformId}`] || {
        status: 'idle',
        products: [],
      };

    return {
      platformId,
      platformName: storeInfo?.name || platformId,
      status: scrapeState.status,
      products: scrapeState.products,
      error: scrapeState.error,
      logo: storeInfo?.logo,
    };
  });

  return (
    <div className="flex flex-col w-full h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <div className="flex overflow-hidden flex-1">
        {/* Center: Products & Platforms */}
        <div className="flex overflow-hidden flex-col flex-1 border-r border-gray-700 max-w-[60%]">
          {/* Platform filters */}
          <div className="px-4 pt-4 pb-4 border-b border-gray-700 bg-gray-800/50">
            <h3 className="flex gap-2 items-center mb-3 text-xs font-semibold text-gray-300">
              <Store className="w-4 h-4" />
              Platforms ({selectedPlatforms.length}/5)
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {stores.map((store) => (
                <button
                  key={store.id}
                  onClick={() => togglePlatform(store.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    selectedPlatforms.includes(store.id)
                      ? 'bg-teal-600 text-black'
                      : 'bg-gray-700 hover:bg-gray-600 text-black'
                  }`}
                >
                  <img
                    src={store.logo}
                    alt={store.name}
                    className="h-5 w-5 object-contain rounded-full bg-white p-0.5 flex-shrink-0"
                  />
                  <span className="whitespace-nowrap">{store.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Product Name */}
          {selectedProduct && (
            <div className="border-b border-gray-700 bg-gray-800/50">
              <h2 className="px-4 py-3 text-base font-semibold text-center text-white">
                {selectedProduct.name}
              </h2>
            </div>
          )}

          {/* Platform results */}
          <div className="overflow-y-auto flex-1 p-4">
            {selectedProduct ? (
              platformResultsData.length > 0 ? (
                <div className="space-y-3">
                  {platformResultsData.map((platform) => (
                    <div
                      key={platform.platformId}
                      className="p-3 rounded-lg border border-gray-700 transition-colors bg-gray-800/50 hover:bg-gray-800"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex gap-2 items-center">
                          {platform.logo && (
                            <img
                              src={platform.logo}
                              alt={platform.platformName}
                              className="h-5 w-5 object-contain rounded-full bg-white p-[1px]"
                            />
                          )}
                          <span className="text-sm font-semibold text-gray-200">
                            {platform.platformName}
                          </span>
                        </div>
                        {platform.status === 'loading' && (
                          <span className="flex gap-1 items-center text-xs text-gray-400">
                            <Loader2 className="w-3 h-3 animate-spin" />{' '}
                            Scraping...
                          </span>
                        )}
                        {platform.status === 'success' && (
                          <span className="text-xs text-green-400">✓ Found</span>
                        )}
                        {platform.status === 'error' && (
                          <span className="text-xs text-red-400">✗ Error</span>
                        )}
                      </div>

                      {platform.status === 'loading' && (
                        <p className="text-xs text-gray-500">
                          Searching {platform.platformName}...
                        </p>
                      )}

                      {platform.status === 'error' && (
                        <p className="text-xs text-red-400">
                          {platform.error}
                        </p>
                      )}

                      {platform.status === 'success' &&
                        platform.products.length === 0 && (
                          <p className="text-xs text-gray-500">
                            No products found
                          </p>
                        )}

                      {platform.status === 'success' &&
                        platform.products.length > 0 && (
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            {platform.products.map((p, idx) => (
                              <a
                                key={idx}
                                href={p.productUrl || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex gap-4 p-3 text-sm rounded-lg border border-gray-600 transition-colors bg-gray-800/70 hover:bg-gray-700/70"
                              >
                                <div className="flex overflow-hidden flex-shrink-0 justify-center items-center w-24 h-24 bg-gray-900 rounded-md">
                                  {p.imageUrl ? (
                                    <img
                                      src={p.imageUrl}
                                      alt={p.name}
                                      className="object-cover w-full h-full"
                                      loading="lazy"
                                    />
                                  ) : (
                                    <span className="px-1 text-xs text-center text-gray-500">
                                      No Image
                                    </span>
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold leading-snug text-gray-100 line-clamp-2">
                                    {p.name}
                                  </p>

                                  <div className="flex gap-2 items-baseline mt-2">
                                    <span className="text-base font-bold text-green-400">
                                      ₹{p.price ?? 'N/A'}
                                    </span>
                                    {p.mrp && p.mrp !== p.price && (
                                      <span className="text-xs text-gray-500 line-through">
                                        ₹{p.mrp}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex gap-2 items-center mt-2">
                                    {p.discount && p.discount > 0 && (
                                      <span className="inline-flex px-2 py-1 text-xs font-semibold text-green-300 rounded-full bg-green-900/60">
                                        {p.discount}% OFF
                                      </span>
                                    )}
                                    {p.isOutOfStock && (
                                      <span className="inline-flex px-2 py-1 text-xs font-semibold text-red-300 rounded-full bg-red-900/60">
                                        Out of Stock
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </a>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Platform results will appear here...
                </p>
              )
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-sm text-center text-gray-500">
                  Loading products...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Chat */}
        <div className="flex flex-col w-2/5 border-l border-gray-700">
          {/* Chat Header */}
          <div className="flex gap-3 items-center p-3 border-b border-gray-700 bg-gray-800/50">
            <button
              onClick={onBack}
              className="p-2 rounded-lg transition-colors hover:bg-gray-700"
            >
              <ArrowLeft className="w-5 h-5 text-gray-300" />
            </button>
            <h1 className="text-lg font-semibold text-white">Bilmo Shopping Agent</h1>
          </div>
          <div className="overflow-y-auto flex-1 p-4 space-y-4">
            {isLoading && messages.length === 1 ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
              </div>
            ) : (
              messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`flex gap-3 max-w-md ${
                      message.type === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user'
                          ? 'bg-teal-600'
                          : 'bg-gray-700'
                      }`}
                    >
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-teal-600 text-black'
                          : 'bg-gray-700 text-gray-100'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <span className={`text-xs opacity-70 mt-1 block ${
                        message.type === 'user' ? 'text-black' : ''
                      }`}>
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-4 border-t border-gray-700 bg-gray-800/50">
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 px-4 py-2 placeholder-gray-400 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <div ref={modeDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm h-[42px]"
                >
                  <Sparkles className="w-4 h-4" />
                  {modes.find((m) => m.id === selectedMode)?.name}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {isModeDropdownOpen && (
                  <div className="absolute right-0 bottom-full z-50 mb-2 w-48 bg-gray-700 rounded-lg border border-gray-600 shadow-lg">
                    {modes.map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => {
                          setSelectedMode(mode.id);
                          setIsModeDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 flex items-center gap-2 ${
                          selectedMode === mode.id
                            ? 'bg-gray-600'
                            : 'hover:bg-gray-600'
                        } transition-colors`}
                      >
                        <mode.icon className="w-4 h-4" />
                        {mode.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="p-2 text-white bg-teal-600 rounded-lg transition-colors hover:bg-teal-700 disabled:bg-gray-600"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
