import { mocked } from 'ts-jest/utils';
import { ConflictException, BadGatewayException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FormDefinitionController } from './form-definitions.controller';
import { FormDefinitionService } from './form-definitions.service';
import { DatabaseModule } from '../database-providers/database.module';

describe('FormDefinitionController', () => {
  let formDefinitionController: FormDefinitionController;
  const mockCreateFn = jest
    .fn()
    .mockResolvedValueOnce({})
    .mockRejectedValueOnce({
      code: 6,
      details:
        'Document already exists: projects/nestjs-serverless-api/databases/(default)/documents/form-definition/magician',
      metadata: { internalRepr: {}, options: {} }
    });
  const firestoreMock = mocked({
    doc: jest.fn(() => ({
      create: mockCreateFn
    }))
  });
  const DOCUMENT_PATH = 'form-definition/magician';

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [FormDefinitionController],
      providers: [FormDefinitionService]
    })
      .overrideProvider('FIREBASE_CONNECTION')
      .useFactory({
        factory: async () => {
          return firestoreMock;
        }
      })
      .compile();

    formDefinitionController = app.get<FormDefinitionController>(FormDefinitionController);
  });

  describe('/form-definition (POST)', () => {
    const formDefinitionBody = {
      magician: [
        {
          key: 'name',
          placeholder: 'Your name...',
          title: 'Name',
          type: 'string',
          validation: {
            required: true
          }
        }
      ]
    };

    it('should create an entry and return empty Object, should throw conflict on repeated data', async () => {
      await expect(
        formDefinitionController.createFormDefinition(formDefinitionBody)
      ).resolves.toStrictEqual({});
      expect(firestoreMock.doc).toHaveBeenCalledWith(DOCUMENT_PATH);
      expect(mockCreateFn).toHaveBeenCalledWith({ ...formDefinitionBody.magician });

      await expect(
        formDefinitionController.createFormDefinition(formDefinitionBody)
      ).rejects.toThrow(ConflictException);
    });
  });
});
