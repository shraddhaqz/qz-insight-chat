import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export function SearchBox({ onSearch, isLoading }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.div
        className={`
          relative flex items-center gap-3 p-2 pl-5 rounded-2xl
          bg-card border transition-all duration-300
          ${isFocused 
            ? 'border-primary/50 shadow-glow' 
            : 'border-border hover:border-primary/30 shadow-soft hover:shadow-elevated'
          }
        `}
        animate={{
          boxShadow: isFocused 
            ? '0 0 30px -5px hsl(var(--primary) / 0.3)' 
            : '0 2px 8px -2px hsl(var(--foreground) / 0.08)'
        }}
      >
        <Sparkles className="w-5 h-5 text-primary/60 flex-shrink-0" />
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ask anything analytical..."
          className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-base py-3"
          disabled={isLoading}
        />

        <motion.button
          type="submit"
          disabled={!query.trim() || isLoading}
          className={`
            flex items-center gap-2 px-5 py-3 rounded-xl font-medium
            transition-all duration-200 text-sm
            ${query.trim() && !isLoading
              ? 'bg-gradient-primary text-primary-foreground hover:opacity-90'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
            }
          `}
          whileHover={query.trim() && !isLoading ? { scale: 1.03 } : {}}
          whileTap={query.trim() && !isLoading ? { scale: 0.97 } : {}}
        >
          {isLoading ? (
            <motion.div
              className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Search</span>
            </>
          )}
        </motion.button>
      </motion.div>
    </motion.form>
  );
}
