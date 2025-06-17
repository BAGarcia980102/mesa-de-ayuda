export interface Request {
  id: number;
  company_name: string;
  address: string;
  contact_name: string;
  phone: string;
  request_type: string;
  assigned_to: string;
  status: string;
  created_at: string;
  is_client_owned: boolean;
  reference?: string;
  asset_tag?: string;
  documents_to_carry: string[];
  fault_description?: string;
  task_to_perform?: string;
  observations?: string;
}

export interface Technician {
  name: string;
  value: string;
}
