import { motion } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';

interface ReasoningCardProps {
  reasoning: string | null;
  isThinking: boolean;
}

export function ReasoningCard({ reasoning, isThinking }: ReasoningCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="glass rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="p-2 rounded-xl bg-gradient-primary"
            animate={isThinking ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1.5, repeat: isThinking ? Infinity : 0 }}
          >
            <Brain className="w-5 h-5 text-primary-foreground" />
          </motion.div>
          <h3 className="text-lg font-semibold text-foreground">Reasoning</h3>
          {isThinking && (
            <motion.div
              className="flex items-center gap-2 ml-auto text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Thinking</span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ...
              </motion.span>
            </motion.div>
          )}
        </div>

        {isThinking ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="h-4 rounded-lg animate-shimmer"
                style={{ width: `${85 - i * 15}%` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-muted-foreground leading-relaxed whitespace-pre-line"
          >
            {reasoning}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
