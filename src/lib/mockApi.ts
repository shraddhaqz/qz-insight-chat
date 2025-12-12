// Mock API for QZ Assistant - Replace with real API calls

export interface Document {
  id: string;
  title: string;
  snippet: string;
  url: string;
}

export interface QueryResponse {
  reasoning: string;
  insight: string;
  confidence: number;
  documents: Document[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function searchQuery(query: string): Promise<QueryResponse> {
  // Simulate network delay
  await delay(2000);
  
  return {
    reasoning: `Analyzing your query: "${query}"\n\nI'm examining multiple data sources and cross-referencing relevant information. The query relates to analytical patterns that require careful consideration of context, historical data, and current trends. I've identified several key factors that influence this analysis, including temporal patterns, correlation matrices, and statistical significance levels.`,
    insight: `Based on comprehensive analysis of your query about "${query}", here are the key findings:\n\n**Primary Insight:** The data suggests a strong correlation between the variables you've mentioned, with a 95% confidence interval. Recent trends indicate an upward trajectory that aligns with historical patterns.\n\n**Key Observations:**\n• Pattern recognition reveals cyclical behavior with a 30-day periodicity\n• Anomaly detection identified 3 significant outliers worth investigating\n• Predictive modeling suggests continued growth in the next quarter\n\n**Recommendation:** Focus on the correlation between primary and secondary metrics for actionable insights.`,
    confidence: 87,
    documents: [
      {
        id: '1',
        title: 'Comprehensive Analytics Report Q4 2024',
        snippet: 'This report covers the analytical frameworks and methodologies used in modern data analysis, including statistical modeling and machine learning approaches...',
        url: '#'
      },
      {
        id: '2',
        title: 'Data Patterns and Trend Analysis',
        snippet: 'Understanding cyclical patterns in data requires a multi-faceted approach combining time-series analysis with contextual factors...',
        url: '#'
      },
      {
        id: '3',
        title: 'Machine Learning in Business Intelligence',
        snippet: 'Modern BI tools leverage machine learning algorithms to provide predictive insights and automate pattern recognition...',
        url: '#'
      },
      {
        id: '4',
        title: 'Statistical Significance in Data Science',
        snippet: 'Determining statistical significance requires careful consideration of sample size, effect size, and confidence intervals...',
        url: '#'
      }
    ]
  };
}

export async function sendChatMessage(
  messages: ChatMessage[],
  newMessage: string
): Promise<string> {
  // Simulate network delay
  await delay(1500);
  
  const responses = [
    "That's an excellent follow-up question. Looking deeper into the data, I can see additional patterns that weren't immediately apparent. The correlation coefficient increases when we factor in seasonal variations.",
    "Great point! Let me elaborate on that aspect. The underlying data suggests that there are multiple contributing factors. When we isolate each variable, we can see distinct behavioral patterns that align with your hypothesis.",
    "I understand your concern. Based on the analysis, the confidence level remains high because we've accounted for various confounding variables. The methodology includes robust error handling and outlier detection.",
    "That's a nuanced question. The data indicates that while there are some exceptions to the general trend, the overall pattern holds with statistical significance. I'd recommend looking at the edge cases for a more complete picture.",
    "Excellent observation! You're right to question that aspect. The analysis accounts for this by using weighted averages that prioritize more recent data points while still maintaining historical context."
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}
