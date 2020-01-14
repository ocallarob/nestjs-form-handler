class ValidationDTO {
  required: boolean;
  maxLength?: number;
  pattern?: string;
  validationMessage?: string;
}

class FormDTO {
  key: string;
  type: string;
  title?: string;
  placeholder?: string;
  options?: string[];
  validation: ValidationDTO;
}

export class FormDefinitionDTO {
  [key: string]: FormDTO[];
}
