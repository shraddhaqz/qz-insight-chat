import { motion } from 'framer-motion';
import { ChevronRight, FileText, ExternalLink } from 'lucide-react';
import type { Document } from '@/lib/api';

interface DocumentsListProps {
  documents: Document[];
}

export function DocumentsList({ documents }: DocumentsListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      <div className="glass rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-all duration-300">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl bg-secondary">
            <FileText className="w-5 h-5 text-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Related Documents</h3>
          <span className="ml-auto text-sm text-muted-foreground">{documents.length} found</span>
        </div>

        <div className="space-y-3">
          {documents.map((doc, index) => (
            <motion.a
              key={doc.id}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/60 transition-all duration-200 cursor-pointer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.08 }}
              whileHover={{ y: -2, boxShadow: '0 4px 12px -2px hsl(var(--foreground) / 0.1)' }}
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground group-hover:text-primary transition-colors duration-200 mb-1 truncate">
                  {doc.file_name}
                </h4>
                <p className="text-sm text-muted-foreground line-clamp-2">{doc.description}</p>
              </div>

              <motion.div
                className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors duration-200 flex-shrink-0"
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
              >
                <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Open
                </span>
                <ExternalLink className="w-4 h-4" />
                <motion.div
                  initial={{ x: 0, opacity: 1 }}
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.div>
              </motion.div>
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
