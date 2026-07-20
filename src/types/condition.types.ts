export interface Condition {
  _id: string;
  title: string;
  description: string;
  symptoms: string[];
  severity: "Low" | "Medium" | "High";
  precautions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ConditionFormData {
  title: string;
  description: string;
  symptoms: string[];
  severity: "Low" | "Medium" | "High";
  precautions: string[];
}

export interface ConditionFilter {
  search?: string;
  severity?: string;
  page?: number;
  limit?: number;
}
