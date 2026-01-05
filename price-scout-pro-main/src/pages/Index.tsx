import { AnimatePresence, motion } from 'framer-motion';
import { SearchPage } from '@/components/SearchPage';
import { LoadingPage } from '@/components/LoadingPage';
import { ResultsPage } from '@/components/ResultsPage';
import { useSearch } from '@/hooks/useSearch';

const Index = () => {
  const { state, statusMessage, startSearch, retryPlatform, reset } = useSearch();

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {state.status === 'idle' && (
          <motion.div
            key="search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SearchPage onSearch={startSearch} />
          </motion.div>
        )}

        {state.status === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingPage
              product={state.query.product}
              location={state.query.location}
              progress={state.progress}
              statusMessage={statusMessage}
              platformStates={state.platformStates}
              onRetry={retryPlatform}
            />
          </motion.div>
        )}

        {state.status === 'completed' && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ResultsPage
              product={state.query.product}
              location={state.query.location}
              results={state.results}
              onBack={reset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
