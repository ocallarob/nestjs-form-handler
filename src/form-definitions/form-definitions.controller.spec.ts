import { Test, TestingModule } from "@nestjs/testing";
import { FormDefinitionController } from "./form-definitions.controller";
import { FormDefinitionService } from "./form-definitions.service";

describe("FormDefinitionController", () => {
  let formDefinitionController: FormDefinitionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FormDefinitionController],
      providers: [FormDefinitionService]
    }).compile();

    formDefinitionController = app.get<FormDefinitionController>(
      FormDefinitionController
    );
  });

  describe("/form-definition (POST)", () => {
    const formDefinitionBody = {
      magician: [
        {
          key: "name",
          placeholder: "Your name...",
          title: "Name",
          type: "string",
          validation: {
            required: true
          }
        }
      ]
    };
    it("should return empty Object", () => {
      expect(
        formDefinitionController.createFormDefinition(formDefinitionBody)
      ).toStrictEqual({});
    });
  });
});
