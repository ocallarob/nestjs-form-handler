import { status as gRPCErrorCodes } from 'grpc';
import { ConflictException, Injectable, Inject } from '@nestjs/common';
import { FormDefinitionDTO } from './form-definition.dto';

const FORM_DEFINITION_COLLECTION = 'form-definition';

@Injectable()
export class FormDefinitionService {
  constructor(@Inject('FIREBASE_CONNECTION') private readonly firestore) {}

  async createFormDefinition(formDefinitionData: FormDefinitionDTO): Promise<Object> {
    try {
      const db = this.firestore;
      const [serviceName, tooMuchData] = Object.keys(formDefinitionData);
      if (tooMuchData) throw new Error('BAd request or somethigns');

      const formDefinitionLocation = db.doc(`${FORM_DEFINITION_COLLECTION}/${serviceName}`);

      await formDefinitionLocation.create({ ...formDefinitionData[serviceName] });
      return {};
    } catch (err) {
      console.log('error', err);
      if (err.code === gRPCErrorCodes.ALREADY_EXISTS) throw new ConflictException();
      throw err;
    }
  }
}
