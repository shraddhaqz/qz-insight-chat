// API Service for QZ Assistant - Real API Integration

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export interface Document {
  id: string;
  file_name: string;
  description: string;
  url: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface QueryResponse {
  reasoning: string;
  conversation: ConversationMessage[];
  relevant_docs: Document[];
  confidence?: number;
}

export interface DeepDiveInitResponse {
  conversation_id: string;
}

export interface DeepDiveQueryResponse {
  conversation: ConversationMessage[];
  reasoning?: string;
  relevant_docs?: Document[];
}

export interface ApiError {
  message: string;
  status: number;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      message: errorData.message || `Request failed with status ${response.status}`,
      status: response.status,
    } as ApiError;
  }
  return response.json();
}

export async function queryApi(
  userId: string,
  sessionId: string,
  userQuestion: string
): Promise<QueryResponse> {
  const response = await fetch(`${API_BASE_URL}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      session_id: sessionId,
      user_question: userQuestion,
    }),
  });

  const data = await handleResponse<{ data: QueryResponse }>(response);
  return data.data;
}

export async function deepDiveInit(
  userId: string,
  sessionId: string,
  lastQuestion: string,
  lastAnswer: string
): Promise<DeepDiveInitResponse> {
  const response = await fetch(`${API_BASE_URL}/deep_dive/init`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      session_id: sessionId,
      last_question: lastQuestion,
      last_answer: lastAnswer,
    }),
  });

  return handleResponse<DeepDiveInitResponse>(response);
}

export async function deepDiveQuery(
  userId: string,
  sessionId: string,
  userQuestion: string,
  conversationId: string
): Promise<DeepDiveQueryResponse> {
  const response = await fetch(`${API_BASE_URL}/deep_dive/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      session_id: sessionId,
      user_question: userQuestion,
      conversation_id: conversationId,
    }),
  });

  const data = await handleResponse<{ data: DeepDiveQueryResponse }>(response);
  return data.data;
}

export async function deepDiveEnd(
  userId: string,
  sessionId: string,
  conversationId: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/deep_dive/end`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      session_id: sessionId,
      conversation_id: conversationId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      message: errorData.message || `Request failed with status ${response.status}`,
      status: response.status,
    } as ApiError;
  }
}
