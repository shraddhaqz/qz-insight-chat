import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight } from 'lucide-react';

interface DeepDiveButtonProps {
  onClick: () => void;
}

export function DeepDiveButton({ onClick }: DeepDiveButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full flex justify-center"
    >
      <motion.button
        onClick={onClick}
        className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-primary text-primary-foreground font-semibold text-lg overflow-hidden"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300"
          initial={false}
        />
        
        <MessageCircle className="w-5 h-5 relative z-10" />
        <span className="relative z-10">Deep Dive</span>
        <motion.div
          className="relative z-10"
          initial={{ x: 0 }}
          whileHover={{ x: 4 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <ArrowRight className="w-5 h-5" />
        </motion.div>

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            translateX: ['100%', '-100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'easeInOut',
          }}
        />
      </motion.button>
    </motion.div>
  );
}
