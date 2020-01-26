import { Controller, Post, Body, Get, Param, Put } from "@nestjs/common";
import { FormDefinitionService } from "./form-definitions.service";
import { FormDefinitionDTO, FormDTO } from "./form-definition.dto";

@Controller()
export class FormDefinitionController {
  constructor(private readonly formDefinitionService: FormDefinitionService) {}

  @Post()
  createFormDefinition(@Body() formDefinitionDTO: FormDefinitionDTO): Object {
    return this.formDefinitionService.createFormDefinition(formDefinitionDTO);
  }

  @Get(":serviceName")
  readFormDefinition(@Param("serviceName") serviceName): Object {
    return this.formDefinitionService.readFormDefinition(serviceName);
  }

  @Put(":serviceName")
  updateFormDefinition(
    @Param("serviceName") serviceName,
    @Body() formDefinitionDTO: FormDTO
  ): Object {
    return this.formDefinitionService.updateFormDefinition(
      serviceName,
      formDefinitionDTO
    );
  }
}
