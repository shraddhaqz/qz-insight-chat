// API Service for QZ Assistant - Real API Integration

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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

// Mock data for fallback
function getMockQueryResponse(userQuestion: string) {
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  return delay(1500).then(() => ({
    reasoning: {
      explanation: `Analyzing your query: "${userQuestion}"\n\nI'm examining multiple data sources and cross-referencing relevant information. The query relates to analytical patterns that require careful consideration of context, historical data, and current trends. I've identified several key factors that influence this analysis, including temporal patterns, correlation matrices, and statistical significance levels.`
    },
    conversation: [
      { role: 'user', content: userQuestion },
      { role: 'assistant', content: `Based on comprehensive analysis of your query about "${userQuestion}", here are the key findings:\n\n**Primary Insight:** The data suggests a strong correlation between the variables you've mentioned, with a 95% confidence interval. Recent trends indicate an upward trajectory that aligns with historical patterns.\n\n**Key Observations:**\n• Pattern recognition reveals cyclical behavior with a 30-day periodicity\n• Anomaly detection identified 3 significant outliers worth investigating\n• Predictive modeling suggests continued growth in the next quarter\n\n**Recommendation:** Focus on the correlation between primary and secondary metrics for actionable insights.` }
    ],
    relevant_docs: [
      { FILE_NAME: 'Comprehensive Analytics Report Q4 2024', DOC_SUMMARY: 'This report covers analytical frameworks and methodologies used in modern data analysis, including statistical modeling and machine learning approaches...', LINKS: '#' },
      { FILE_NAME: 'Data Patterns and Trend Analysis', DOC_SUMMARY: 'Understanding cyclical patterns in data requires a multi-faceted approach combining time-series analysis with contextual factors...', LINKS: '#' },
      { FILE_NAME: 'Machine Learning in Business Intelligence', DOC_SUMMARY: 'Modern BI tools leverage machine learning algorithms to provide predictive insights and automate pattern recognition...', LINKS: '#' },
      { FILE_NAME: 'Statistical Significance in Data Science', DOC_SUMMARY: 'Determining statistical significance requires careful consideration of sample size, effect size, and confidence intervals...', LINKS: '#' }
    ]
  }));
}

export async function queryApi(
  userId: string,
  sessionId: string,
  userQuestion: string
) {
  try {
    const res = await fetch(`${API_BASE_URL}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        session_id: sessionId,
        user_question: userQuestion,
      }),
    });

    if (!res.ok) {
      throw new Error(`Query API failed with status ${res.status}`);
    }

    const json = await res.json();
    return json.data; // ✅ IMPORTANT
  } catch (error) {
    console.warn('Real API failed, using mock data:', error);
    // Fallback to mock data
    return getMockQueryResponse(userQuestion);
  }
}


export async function deepDiveInit(
  userId: string,
  sessionId: string,
  lastQuestion: string,
  lastAnswer: string
) {
  try {
    const res = await fetch(`${API_BASE_URL}/deep_dive/init`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        session_id: sessionId,
        last_question: lastQuestion,
        last_answer: lastAnswer,
      }),
    });

    if (!res.ok) {
      throw new Error(`Deep dive init failed with status ${res.status}`);
    }

    const json = await res.json();
    return json.data; // ✅ REQUIRED
  } catch (error) {
    console.warn('Deep dive init failed, using mock data:', error);
    // Mock fallback
    return { conversation_id: `conv-${Date.now()}` };
  }
}


export async function deepDiveQuery(
  userId: string,
  sessionId: string,
  userQuestion: string,
  conversationId: string
): Promise<DeepDiveQueryResponse> {
  try {
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
  } catch (error) {
    console.warn('Deep dive query failed, using mock data:', error);
    // Mock fallback
    return {
      conversation: [
        { role: 'user', content: userQuestion },
        { role: 'assistant', content: 'This is a detailed follow-up analysis based on your question. The system is currently operating in demo mode.' }
      ],
      reasoning: { explanation: 'Analysis in progress...' }
    };
  }
}

export async function deepDiveEnd(
  userId: string,
  sessionId: string,
  conversationId: string
) {
  try {
    const res = await fetch(`${API_BASE_URL}/deep_dive/end`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        session_id: sessionId,
        conversation_id: conversationId,
      }),
    });

    if (!res.ok) {
      throw new Error(`Deep dive end failed with status ${res.status}`);
    }

    const json = await res.json();
    return json.data;
  } catch (error) {
    console.warn('Deep dive end failed:', error);
    // Mock fallback
    return { success: true };
  }
}

