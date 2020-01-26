import { status as gRPCErrorCodes } from "grpc";
import {
  ConflictException,
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException
} from "@nestjs/common";
import { FormDefinitionDTO, FormDTO } from "./form-definition.dto";

const FORM_DEFINITION_COLLECTION = "form-definition";

@Injectable()
export class FormDefinitionService {
  constructor(@Inject("FIREBASE_CONNECTION") private readonly firestore) {}

  async readFormDefinition(serviceName: String): Promise<Object> {
    try {
      const db = this.firestore;
      const formDefinitionLocation = db.doc(
        `${FORM_DEFINITION_COLLECTION}/${serviceName}`
      );
      const formDefinition = await formDefinitionLocation.get();
      if (formDefinition.exists) return formDefinition.data();
    } catch (err) {
      console.log("error", err);
      throw err;
    }
    throw new NotFoundException();
  }

  async createFormDefinition(
    formDefinitionData: FormDefinitionDTO
  ): Promise<Object> {
    try {
      const db = this.firestore;
      const [serviceName, tooMuchData] = Object.keys(formDefinitionData);
      if (tooMuchData) throw new BadRequestException();

      const formDefinitionLocation = db.doc(
        `${FORM_DEFINITION_COLLECTION}/${serviceName}`
      );

      await formDefinitionLocation.create({
        ...formDefinitionData[serviceName]
      });
      return {};
    } catch (err) {
      console.log("error", err);
      if (err.code === gRPCErrorCodes.ALREADY_EXISTS)
        throw new ConflictException();
      throw err;
    }
  }

  async updateFormDefinition(
    serviceName: String,
    formDefinitionData: FormDTO
  ): Promise<Object> {
    try {
      const db = this.firestore;
      const formDefinitionLocation = db.doc(
        `${FORM_DEFINITION_COLLECTION}/${serviceName}`
      );
      console.log(formDefinitionData);

      await formDefinitionLocation.update({
        [`${serviceName}`]: formDefinitionData
      });
      return {};
    } catch (err) {
      console.log("error", err);
      if (err.code === gRPCErrorCodes.NOT_FOUND) throw new NotFoundException();
      throw err;
    }
  }
}
