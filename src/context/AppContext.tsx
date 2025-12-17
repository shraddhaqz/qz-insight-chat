import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  userId: string;
  sessionId: string;
  conversationId: string | null;
  lastQuestion: string;
  lastAnswer: string;
}

interface AppContextValue extends AppState {
  setConversationId: (id: string | null) => void;
  setLastQA: (question: string, answer: string) => void;
  clearConversation: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// Generate or retrieve user ID from localStorage
function getOrCreateUserId(): string {
  const storedId = localStorage.getItem('qz_user_id');
  if (storedId) return storedId;
  const newId = uuidv4();
  localStorage.setItem('qz_user_id', newId);
  return newId;
}

// Generate session ID (new for each browser session)
function generateSessionId(): string {
  const existing = sessionStorage.getItem('qz_session_id');
  if (existing) return existing;
  const newId = uuidv4();
  sessionStorage.setItem('qz_session_id', newId);
  return newId;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => ({
    userId: getOrCreateUserId(),
    sessionId: generateSessionId(),
    conversationId: null,
    lastQuestion: '',
    lastAnswer: '',
  }));

  const setConversationId = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, conversationId: id }));
  }, []);

  const setLastQA = useCallback((question: string, answer: string) => {
    setState(prev => ({
      ...prev,
      lastQuestion: question,
      lastAnswer: answer,
    }));
  }, []);

  const clearConversation = useCallback(() => {
    setState(prev => ({
      ...prev,
      conversationId: null,
    }));
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      setConversationId,
      setLastQA,
      clearConversation,
    }),
    [state, setConversationId, setLastQA, clearConversation]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
}
