import { Controller, Post, Body } from "@nestjs/common";
import { FormDefinitionService } from "./form-definitions.service";
import { FormDefinitionDTO } from "./form-definition.dto";

@Controller()
export class FormDefinitionController {
  constructor(private readonly formDefinitionService: FormDefinitionService) {}

  @Post()
  createFormDefinition(@Body() formDefinitionDTO: FormDefinitionDTO): Object {
    return this.formDefinitionService.createFormDefinition(formDefinitionDTO);
  }
}
