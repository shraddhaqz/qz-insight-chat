import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp } from 'lucide-react';

interface InsightCardProps {
  insight: string;
  confidence: number;
}

export function InsightCard({ insight, confidence }: InsightCardProps) {
  const getConfidenceColor = (value: number) => {
    if (value >= 80) return 'text-accent bg-accent/10 border-accent/30';
    if (value >= 60) return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
    return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full"
    >
      <div className="glass rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="p-2 rounded-xl bg-accent/20"
              whileHover={{ scale: 1.1 }}
            >
              <Lightbulb className="w-5 h-5 text-accent" />
            </motion.div>
            <h3 className="text-lg font-semibold text-foreground">AI Insight</h3>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getConfidenceColor(confidence)}`}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">{confidence}% Confidence</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="prose prose-sm max-w-none text-muted-foreground leading-relaxed"
        >
          {insight.split('\n').map((line, index) => {
            if (line.startsWith('**') && line.endsWith('**')) {
              return (
                <h4 key={index} className="text-foreground font-semibold mt-4 mb-2 first:mt-0">
                  {line.replace(/\*\*/g, '')}
                </h4>
              );
            }
            if (line.startsWith('•')) {
              return (
                <motion.p
                  key={index}
                  className="flex items-start gap-2 my-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <span className="text-accent mt-1">•</span>
                  <span>{line.substring(1).trim()}</span>
                </motion.p>
              );
            }
            if (line.trim()) {
              return <p key={index} className="my-2">{line}</p>;
            }
            return null;
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}
