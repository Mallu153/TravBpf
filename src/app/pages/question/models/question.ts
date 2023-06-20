export interface Question {
  createdBy: string;
  createdDate?: string;
  department: number;
  description: string;
  id: number;
  language: number;
  options: string;
  organization: number;
  question: string;
  reference: number;
  referenceType: string;
  service: string;
  source: string;
  status: string;
  type: number;
  updatedBy: string;
  updatedDate?: string;
}
