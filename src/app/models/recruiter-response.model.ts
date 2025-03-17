export interface RecruiterResponse {
    id: number;
    name: string;
    email: string;
    company: string;
    jobTitle: string;
    location: string;
    language: Language;
    status: RecruiterStatus;
    feedback: string;
  }
  
  export enum Language {
    EN = 'EN',
    FR = 'FR'
  }
  
  export enum RecruiterStatus {
    CONTACTED = 'CONTACTED',
    RESPONDED = 'RESPONDED',
    POSITIVE_FEEDBACK = 'POSITIVE_FEEDBACK',
    NEGATIVE_FEEDBACK = 'NEGATIVE_FEEDBACK',
    FOLLOW_UP_REQUIRED = 'FOLLOW_UP_REQUIRED',
    CLOSED = 'CLOSED'
  }