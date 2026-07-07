export interface PlacementRequestFormData {
  company_id: number;
  job_title: string;
  job_category: string;
  employment_type: string;
  number_of_positions: number;
  work_location: string;
  job_description: string;
  requirements: string;
  japanese_level_required: string;
  visa_type_required: string;
  salary_type: string;
  salary_amount: number;
  working_hours: string;
  days_off: string;
  start_date: string;
}

export interface PlacementRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: number;
  onSuccess?: (result?: any) => void;
}
