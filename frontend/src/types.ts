export interface Request {
  id: number;
  company_name: string;
  address: string;
  contact_name: string;
  phone: string;
  request_type: string;
  reference?: string;
  is_client_owned?: boolean;
  asset_tag?: string;
  fault_description?: string;
  task_to_perform?: string;
  documents_to_carry: string[];
  observations?: string;
  status: string;
  created_at: string;
}

export interface Technician {
  id: number;
  name: string;
}
