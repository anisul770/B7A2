export interface IIssue {
  title: string;
  description: string;
  type: string;
  reporter_id: number;
  status?: string;
}

export interface IResult {
  id: number;
  title: string;
  description: string;
  type: string;
  status: string;
  reporter_id : number;
  created_at: string;
  updated_at: string;
}