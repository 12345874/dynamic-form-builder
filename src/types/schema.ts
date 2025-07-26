// Types
export interface Option {
  value: string;
  label: string;
}

export interface ValidationRule {
  type: string;
  message: string;
  value?: number | string;
}

export interface Field {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  options?: Option[];
  dependsOn?: {
    fieldId: string;
    condition: string;
    value: string;
  };
  validation?: ValidationRule[];
  placeholder?: string;
}

export interface FormSchema {
  title: string;
  fields: Field[];
  submitButton: {
    text: string;
    loadingText: string;
  };
}

export interface FormData {
  [key: string]: string | boolean | number;
}
