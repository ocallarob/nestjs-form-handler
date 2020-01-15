import { Injectable, Inject } from '@nestjs/common';
import { FormDefinitionDTO } from './form-definition.dto';

@Injectable()
export class FormDefinitionService {
  constructor(@Inject('FIREBASE_CONNECTION') private readonly firestore) {}

  async createFormDefinition(formDefinitionData: FormDefinitionDTO): Promise <Object> {
    await this.firestore
      .collection('nestjs-serverless-api')
      .doc('test')
      .set({ foo: 'bar' });
    return {};
  }
}
