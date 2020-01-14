import { Injectable } from "@nestjs/common";
import { FormDefinitionDTO } from "./form-definition.dto";

@Injectable()
export class FormDefinitionService {
  createFormDefinition(formDefinitionData: FormDefinitionDTO): Object {
    return {};
  }
}
