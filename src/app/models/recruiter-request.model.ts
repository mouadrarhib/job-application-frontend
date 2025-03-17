import { Language, RecruiterStatus } from './recruiter-response.model';

export interface RecruiterRequest {
  name: string;
  email: string;
  company: string;
  jobTitle: string;
  location: string;
  language: Language;
  status: RecruiterStatus;
  feedback: string;
}