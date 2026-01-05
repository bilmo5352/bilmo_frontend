import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlatformState, PLATFORMS, Platform } from '@/types/search';

interface LoadingPageProps {
  product: string;
  location: string;
  progress: number;
  statusMessage: string;
  platformStates: PlatformState[];
  onRetry: (platform: Platform) => void;
}

export function LoadingPage({
  product,
  location,
  progress,
  statusMessage,
  platformStates,
  onRetry,
}: LoadingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Searching prices for{' '}
            <span className="text-gradient">"{product}"</span>
          </h1>
          <p className="text-muted-foreground">in {location}</p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-primary rounded-full relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-progress-shimmer" />
            </motion.div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>{progress}% complete</span>
            <span>{platformStates.filter(p => p.status === 'completed').length}/{platformStates.length} platforms</span>
          </div>
        </div>

        {/* Status Message */}
        <AnimatePresence mode="wait">
          <motion.div
            key={statusMessage}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-10"
          >
            <p className="text-lg text-foreground/80 font-medium">{statusMessage}</p>
          </motion.div>
        </AnimatePresence>

        {/* Platform Status List */}
        <div className="space-y-3">
          {platformStates.map((ps, index) => {
            const platformInfo = PLATFORMS.find(p => p.id === ps.platform);
            
            return (
              <motion.div
                key={ps.platform}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className={`
                  flex items-center justify-between p-4 rounded-xl border
                  ${ps.status === 'in-progress' ? 'bg-primary/5 border-primary/20' : 'bg-card border-border/50'}
                  transition-all duration-300
                `}
              >
                <div className="flex items-center gap-3">
                  <StatusIcon status={ps.status} />
                  <span className="font-medium">{platformInfo?.name}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  {ps.status === 'completed' && ps.productCount !== undefined && (
                    <span className="text-sm text-success">{ps.productCount} products found</span>
                  )}
                  {ps.status === 'failed' && (
                    <>
                      <span className="text-sm text-destructive">{ps.error}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRetry(ps.platform)}
                        className="h-8 px-3 text-xs hover:bg-primary/10 hover:text-primary"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Retry
                      </Button>
                    </>
                  )}
                  {ps.status === 'queued' && (
                    <span className="text-sm text-muted-foreground">Waiting...</span>
                  )}
                  {ps.status === 'in-progress' && (
                    <span className="text-sm text-primary">Scanning...</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

function StatusIcon({ status }: { status: PlatformState['status'] }) {
  switch (status) {
    case 'queued':
      return <Clock className="w-5 h-5 text-muted-foreground" />;
    case 'in-progress':
      return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
    case 'completed':
      return <CheckCircle2 className="w-5 h-5 text-success" />;
    case 'failed':
      return <XCircle className="w-5 h-5 text-destructive" />;
  }
}
