import { IsDefined, IsBoolean, IsArray } from 'class-validator';

class ValidationDTO {
  @IsDefined()
  @IsBoolean()
  required: boolean;
  maxLength?: number;
  pattern?: string;
  validationMessage?: string;
}

export class FormDTO {
  @IsDefined()
  key: string;
  @IsDefined()
  type: string;
  title?: string;
  placeholder?: string;
  @IsArray()
  options?: string[];
  @IsDefined()
  validation: ValidationDTO;
}

export class FormDefinitionDTO {
  [key: string]: FormDTO[];
}
