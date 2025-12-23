import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Bot, User, ShoppingBag, Loader2, ChevronDown, Heart, Wallet, Sparkles, Store } from 'lucide-react';

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
  const [selectedStores, setSelectedStores] = useState(['zepto', 'instamart', 'dmart']);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState(['dmart', 'jiomart', 'naturesbasket', 'zepto', 'swiggy']);
  const [selectedMode, setSelectedMode] = useState('default');
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
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
    { id: 'dmart', name: 'DMart', color: 'from-yellow-500 to-yellow-600' },
    { id: 'jiomart', name: 'JioMart', color: 'from-blue-500 to-blue-600' },
    { id: 'naturesbasket', name: 'NaturesBasket', color: 'from-emerald-500 to-emerald-600' },
    { id: 'zepto', name: 'Zepto', color: 'from-purple-500 to-purple-600' },
    { id: 'swiggy', name: 'Swiggy', color: 'from-orange-500 to-orange-600' },
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

  // API call function
  const callLLMAPI = async (userQuery, mode) => {
    try {
      const response = await fetch('https://bilmollm-production.up.railway.app/chat', {
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
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Parse the assistant response (it's a JSON string)
      let summary = '';
      let productsList = [];
      try {
        const parsedAssistant = JSON.parse(data.assistant);
        summary = parsedAssistant.summary || data.assistant;
        productsList = mapProductsFromResponse(parsedAssistant.products);
      } catch (e) {
        // If parsing fails, use the raw assistant response
        summary = data.assistant;
      }

      return { summary, productsList, error: null };
    } catch (error) {
      console.error('API call error:', error);
      return { summary: null, productsList: [], error: error.message };
    }
  };

  // Handle initial query when page loads
  useEffect(() => {
    if (query && processedQueryRef.current !== query) {
      processedQueryRef.current = query;
      setIsLoading(true);
      callLLMAPI(query, selectedMode).then(({ summary, productsList, error }) => {
        setIsLoading(false);
        if (error) {
          setMessages(prev => [
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
            setMessages(prev => [
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
          if (nextProducts.length > 0) {
            setSelectedProductId(nextProducts[0].id);
          }
        }
      });
    }
  }, [query]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modeDropdownRef.current && !modeDropdownRef.current.contains(event.target)) {
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

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);

    // Call LLM API
    const { summary, productsList, error } = await callLLMAPI(userQuery, selectedMode);
    setIsLoading(false);

    if (error) {
      setMessages(prev => [
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
        setMessages(prev => [
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
      if (nextProducts.length > 0) {
        setSelectedProductId(nextProducts[0].id);
      }
    }
  };

  const togglePlatform = (platformId) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const platformResults = selectedPlatforms.map((platformId) => ({
    platformId,
    platformName: stores.find((s) => s.id === platformId)?.name || platformId,
    price: selectedProduct ? selectedProduct.price : '',
    name: selectedProduct ? selectedProduct.name : 'Selected product',
  }));

  return (
    <div className="flex h-full w-full bg-background overflow-hidden">
      {/* Left Section - Chat */}
      <div className="flex flex-col w-full md:w-[45%] border-r border-border">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Bilmo Assistant</span>
          </div>
          {/* Mode Dropdown */}
          <div className="relative" ref={modeDropdownRef}>
            <button
              onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border hover:border-primary/50 hover:bg-muted transition-all text-sm font-medium text-foreground"
            >
              {(() => {
                const ModeIcon = modes.find(m => m.id === selectedMode)?.icon || Sparkles;
                return <ModeIcon className="w-4 h-4" />;
              })()}
              <span className="capitalize">{modes.find(m => m.id === selectedMode)?.name || 'Default'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isModeDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isModeDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden"
              >
                {modes.map((mode) => {
                  const ModeIcon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => {
                        setSelectedMode(mode.id);
                        setIsModeDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm transition-colors ${
                        selectedMode === mode.id
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <ModeIcon className="w-4 h-4" />
                      <span>{mode.name}</span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-foreground'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 justify-start"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-card border border-border rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Bilmo agent about products..."
              className="flex-1 h-12 px-4 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-foreground placeholder:text-muted-foreground transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="h-12 w-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all glow flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Right Section - Products */}
      <div className="hidden md:flex flex-col w-[55%] bg-card/30 backdrop-blur-sm">
        {/* Product Filters */}
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-foreground">Products</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Store className="w-4 h-4" />
              <span className="text-foreground font-semibold">{products.length}</span>
              <span>returned</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {products.length === 0 ? (
              <span className="text-xs text-muted-foreground">No products yet</span>
            ) : (
              products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => setSelectedProductId(product.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    selectedProductId === product.id
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'border-border text-foreground hover:border-primary/50'
                  }`}
                >
                  {product.name}
                </button>
              ))
            )}
          </div>
          {/* Platform Filters */}
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-xs font-semibold text-foreground">Platforms</h4>
            <div className="text-[11px] text-muted-foreground">
              {selectedPlatforms.length} selected / {stores.length}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {stores.map((store) => (
              <button
                key={store.id}
                onClick={() => togglePlatform(store.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedPlatforms.includes(store.id)
                    ? `bg-gradient-to-r ${store.color} text-white shadow-lg`
                    : 'bg-card border border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                {store.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid (platform results placeholder) */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Loading products...</p>
              </div>
            </div>
          ) : !selectedProduct ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">No products found</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {platformResults.map((result, index) => (
                <motion.div
                  key={`${result.platformId}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all cursor-pointer group"
                >
                  <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    {selectedProduct.image ? (
                      <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingBag className="w-12 h-12 text-muted-foreground opacity-30" />
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                    {selectedProduct.name}
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">{selectedProduct.price}</span>
                    <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                      {result.platformName}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Platform results will appear here after integration.
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;

