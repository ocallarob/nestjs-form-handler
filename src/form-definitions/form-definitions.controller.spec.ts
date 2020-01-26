import { mocked } from "ts-jest/utils";
import {
  ConflictException,
  NotFoundException,
  BadRequestException
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { DatabaseModule } from "../database-providers/database.module";

import { FormDefinitionController } from "./form-definitions.controller";
import { FormDefinitionService } from "./form-definitions.service";

describe("FormDefinitionController", () => {
  let formDefinitionController: FormDefinitionController;

  const dummyFormDefinition = {
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
  const dummyFormDefinitionServiceName = Object.keys(dummyFormDefinition)[0];
  const firestoreFormatFormDefinition = Object.keys(
    dummyFormDefinition[dummyFormDefinitionServiceName]
  ).reduce(
    (formattedObject, arrayPosition) => ({
      ...formattedObject,
      [arrayPosition]:
        dummyFormDefinition[dummyFormDefinitionServiceName][arrayPosition]
    }),
    {}
  );

  const mockCreateFn = jest
    .fn()
    .mockResolvedValueOnce({})
    .mockRejectedValueOnce({
      code: 6,
      details:
        "Document already exists: projects/nestjs-serverless-api/databases/(default)/documents/form-definition/magician",
      metadata: { internalRepr: {}, options: {} }
    });
  const mockGetFn = jest
    .fn()
    .mockResolvedValueOnce({
      exists: true,
      data: () => dummyFormDefinition[dummyFormDefinitionServiceName]
    })
    .mockResolvedValueOnce({
      exists: false
    });
  const mockUpdateFn = jest
    .fn()
    .mockResolvedValueOnce({})
    .mockRejectedValueOnce({
      code: 5,
      details:
        "No document to update: projects/nestjs-serverless-api/databases/(default)/documents/form-definition/nonExistentService",
      metadata: { internalRepr: {}, options: {} }
    });

  const firestoreMock = mocked({
    doc: jest.fn(() => ({
      create: mockCreateFn,
      get: mockGetFn,
      update: mockUpdateFn
    }))
  });
  const DOCUMENT_PATH = "form-definition/magician";

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [FormDefinitionController],
      providers: [FormDefinitionService]
    })
      .overrideProvider("FIREBASE_CONNECTION")
      .useFactory({
        factory: async () => {
          return firestoreMock;
        }
      })
      .compile();

    formDefinitionController = app.get<FormDefinitionController>(
      FormDefinitionController
    );
  });

  describe("createFormDefinition", () => {
    it("should create an entry and return empty Object, should throw conflict on repeated data", async () => {
      await expect(
        formDefinitionController.createFormDefinition(dummyFormDefinition)
      ).resolves.toStrictEqual({});
      expect(firestoreMock.doc).toHaveBeenCalledWith(DOCUMENT_PATH);
      expect(mockCreateFn).toHaveBeenCalledWith({
        ...dummyFormDefinition.magician
      });

      await expect(
        formDefinitionController.createFormDefinition(dummyFormDefinition)
      ).rejects.toThrow(ConflictException);
    });

    it(`Should only accept one service definition at a time`, async () => {
      await expect(
        formDefinitionController.createFormDefinition({
          ...dummyFormDefinition,
          anotherDefinition: {
            ...dummyFormDefinition[dummyFormDefinitionServiceName]
          }
        })
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("readFormDefinition", () => {
    it("should return an entry from the DB", async () => {
      await expect(
        formDefinitionController.readFormDefinition(
          `${dummyFormDefinitionServiceName}`
        )
      ).resolves.toStrictEqual(firestoreFormatFormDefinition);
      expect(firestoreMock.doc).toHaveBeenCalledWith(DOCUMENT_PATH);
      expect(mockGetFn).toHaveBeenCalledWith();

      await expect(
        formDefinitionController.readFormDefinition("nonExistentService")
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("updateFormDefinition", () => {
    it("should return an entry from the DB", async () => {
      await expect(
        formDefinitionController.updateFormDefinition(
          `${dummyFormDefinitionServiceName}`,
          dummyFormDefinition[dummyFormDefinitionServiceName]
        )
      ).resolves.toStrictEqual({});
      expect(firestoreMock.doc).toHaveBeenCalledWith(DOCUMENT_PATH);
      expect(mockUpdateFn).toHaveBeenCalledWith(dummyFormDefinition.magician);

      await expect(
        formDefinitionController.updateFormDefinition(
          "nonExistentService",
          dummyFormDefinition[dummyFormDefinitionServiceName]
        )
      ).rejects.toThrow(NotFoundException);
    });
  });
});
