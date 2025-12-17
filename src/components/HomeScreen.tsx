import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { SearchBox } from './SearchBox';
import { ReasoningCard } from './ReasoningCard';
import { InsightCard } from './InsightCard';
import { DocumentsList } from './DocumentsList';
import { DeepDiveButton } from './DeepDiveButton';
import { DeepDiveChat } from './DeepDiveChat';
import { queryApi, deepDiveInit, deepDiveEnd, type Document as ApiDocument } from '@/lib/api';
import { useAppState } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';

interface QueryResult {
  reasoning: string;
  insight: string;
  confidence: number;
  documents: ApiDocument[];
}

export function HomeScreen() {
  const { userId, sessionId, conversationId, setConversationId, setLastQA, clearConversation } = useAppState();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [response, setResponse] = useState<QueryResult | null>(null);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleSections, setVisibleSections] = useState({
    reasoning: false,
    insight: false,
    documents: false,
    deepDive: false,
  });

  const handleSearch = async (query: string) => {
    setCurrentQuery(query);
    setIsLoading(true);
    setIsThinking(true);
    setResponse(null);
    setError(null);
    setVisibleSections({
      reasoning: true,
      insight: false,
      documents: false,
      deepDive: false,
    });

    try {
      const result = await queryApi(userId, sessionId, query);
      
      // Extract assistant message from conversation
      const assistantMessage = result.conversation.find(m => m.role === 'assistant');
      const insight = assistantMessage?.content || '';
      
      // Transform documents to match expected format
      const documents: ApiDocument[] = result.relevant_docs.map((doc, idx) => ({
        id: doc.id || String(idx),
        file_name: doc.file_name,
        description: doc.description,
        url: doc.url,
      }));

      setResponse({
        reasoning: result.reasoning,
        insight,
        confidence: result.confidence || 85,
        documents,
      });
      
      // Save last Q&A for deep dive
      setLastQA(query, insight);
      setIsThinking(false);

      // Sequential reveal animations
      setTimeout(() => setVisibleSections(prev => ({ ...prev, insight: true })), 300);
      setTimeout(() => setVisibleSections(prev => ({ ...prev, documents: true })), 600);
      setTimeout(() => setVisibleSections(prev => ({ ...prev, deepDive: true })), 900);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed. Please try again.';
      setError(message);
      setIsThinking(false);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeepDiveOpen = async () => {
    if (!response) return;
    
    try {
      const { conversation_id } = await deepDiveInit(
        userId,
        sessionId,
        currentQuery,
        response.insight
      );
      setConversationId(conversation_id);
      setIsChatOpen(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start deep dive.';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const handleDeepDiveClose = async () => {
    if (conversationId) {
      try {
        await deepDiveEnd(userId, sessionId, conversationId);
      } catch (err) {
        console.error('Failed to end deep dive session:', err);
      }
      clearConversation();
    }
    setIsChatOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container max-w-4xl mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12 md:mb-16"
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="p-2.5 rounded-2xl bg-gradient-primary"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Zap className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <span className="text-xl font-bold text-foreground">QZ Assistant</span>
          </div>
          <ThemeToggle />
        </motion.header>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-10 md:mb-14"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            <span className="text-gradient">QZ Assistant</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
            Shoot your analytical queries. I will get you the best possible information.
          </p>
        </motion.div>

        {/* Search */}
        <SearchBox onSearch={handleSearch} isLoading={isLoading} />

        {/* Error State */}
        <AnimatePresence>
          {error && !response && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-10 p-6 rounded-2xl bg-destructive/10 border border-destructive/20 text-center"
            >
              <p className="text-destructive font-medium">{error}</p>
              <p className="text-muted-foreground text-sm mt-2">Please try again or contact support.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence mode="wait">
          {(visibleSections.reasoning || response) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-10 space-y-6"
            >
              {visibleSections.reasoning && (
                <ReasoningCard
                  reasoning={response?.reasoning || null}
                  isThinking={isThinking}
                />
              )}

              {visibleSections.insight && response && (
                <InsightCard
                  insight={response.insight}
                  confidence={response.confidence}
                />
              )}

              {visibleSections.documents && response && response.documents.length > 0 && (
                <DocumentsList documents={response.documents} />
              )}

              {visibleSections.deepDive && response && (
                <DeepDiveButton onClick={handleDeepDiveOpen} />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Powered by advanced analytics • Built with precision
          </p>
        </motion.footer>
      </div>

      {/* Deep Dive Chat */}
      <DeepDiveChat
        isOpen={isChatOpen}
        onClose={handleDeepDiveClose}
        initialQuery={currentQuery}
        initialInsight={response?.insight || ''}
      />
    </div>
  );
}
