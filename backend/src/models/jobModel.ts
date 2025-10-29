export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  link: string | null;
  contact: string | null;
  createdAt: string;
  updatedAt?: string;
}
