export interface ChatMessage {
  _id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface ChatSession {
  _id: string;
  title: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface SymptomAnalysis {
  id: string;
  symptoms: string[];
  possibleConditions: PossibleCondition[];
  recommendations: string[];
  severity: "low" | "medium" | "high";
  disclaimer: string;
  createdAt: string;
}

export interface PossibleCondition {
  name: string;
  probability: number;
  description: string;
  urgency: "immediate" | "soon" | "routine";
}

export interface ReportAnalysis {
  id: string;
  reportType: string;
  findings: ReportFinding[];
  summary: string;
  recommendations: string[];
  analyzedAt: string;
}

export interface ReportFinding {
  parameter: string;
  value: string;
  referenceRange: string;
  status: "normal" | "abnormal" | "critical";
  interpretation: string;
}

export interface AIRecommendation {
  id: string;
  type: "medication" | "lifestyle" | "follow_up" | "prevention";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

export interface AIChatRequest {
  message: string;
  sessionId?: string;
}

export interface AIChatResponse {
  message: string;
  sessionId: string;
  recommendations?: AIRecommendation[];
}
