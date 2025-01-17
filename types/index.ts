export interface Record {
    id: number;
    name: string;
    email: string;
    company: string;
    designation: string;
    reportedDate: string;
    status: 'Published' | 'Pending' | 'Resolved';
    employerRemarks: string;
    employeeResponse: string | null;
    documents: string[];
    responseDeadline: string;
    resolved: boolean;
  }
  
  export interface LoginFormProps {
    onLogin: (username: string, password: string) => void;
  }
  
  export interface ResponseFormProps {
    onSubmit: (response: string, documents: File[]) => void;
  }