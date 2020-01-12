import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/ (GET)", () => {
    return request(app.getHttpServer())
      .get("/")
      .expect(200)
      .expect("Hello World!");
  });

  const formDefinitionPath = "/form-definitions";
  const dummyFormDefinition = {
    magician: [
      {
        key: "magictype",
        options: [
          {
            name: "Mix and mingle magic",
            value: "mixmingle"
          },
          {
            name: "Magic show",
            value: "magicshow"
          },
          {
            name: "Table magic",
            value: "tablemagic"
          }
        ],
        title: "How would you like the magic performed?",
        type: "radios",
        validation: {
          required: true
        }
      },
      {
        key: "magicstyle",
        options: [
          {
            name: "Illusionist",
            value: "illusionist"
          },
          {
            name: "Escapologist",
            value: "escapologist"
          },
          {
            name: "Close Up",
            value: "closeup"
          }
        ],
        title: "What types of magic would you like performed?",
        type: "radios",
        validation: {
          required: true
        }
      },
      {
        key: "eventType",
        options: [
          {
            name: "Birthday",
            value: "birthday"
          },
          {
            name: "Wedding",
            value: "wedding"
          },
          {
            name: "Stag Party",
            value: "stagparty"
          }
        ],
        title: "Event type",
        type: "radios",
        validation: {
          required: true
        }
      },
      {
        key: "body",
        placeholder: "Compose message...",
        title: "Your Personal Message to Suppliers",
        type: "textarea",
        validation: {
          maxLength: 250,
          required: true,
          validationMessage: "Personal message is required!"
        }
      },
      {
        key: "name",
        placeholder: "Your name...",
        title: "Name",
        type: "string",
        validation: {
          required: true
        }
      },
      {
        key: "email",
        placeholder: "Your email...",
        title: "Email",
        type: "string",
        validation: {
          pattern: "^\\S+@\\S+$",
          required: true
        }
      },
      {
        key: "date",
        placeholder: "Date of your event",
        type: "date",
        validation: {
          minDate: "2018-01-21",
          required: true
        }
      },
      {
        title: "Get Quotes",
        type: "submit"
      }
    ]
  };
  const formDefinitionUpdateData = {
    magician: dummyFormDefinition.magician.slice(0, 2)
  };
  const formDefinitionServiceName = "magician";

  describe(`Form Definition CRUD`, () => {
    describe(`When POST is made to ${formDefinitionPath}`, () => {
      it(`Should create a new Form Definition entry in the DB and return 201`, () => {
        return request(app.getHttpServer())
          .post(formDefinitionPath)
          .send(dummyFormDefinition)
          .expect(201);
      });
      describe(`If the request body is bad`, () => {
        it(`Should return 400`, () => {
          return request(app.getHttpServer())
            .post(formDefinitionPath)
            .send(dummyFormDefinition)
            .expect(400);
        });
      });
    });

    describe(`When GET is made to the ${formDefinitionPath}/${formDefinitionServiceName}`, () => {
      it(`Should return the Form Definition entry from the DB and status 200`, () => {
        return request(app.getHttpServer())
          .get(`${formDefinitionPath}/${formDefinitionServiceName}`)
          .expect(dummyFormDefinition)
          .expect(200);
      });
      describe(`If the entry is not found`, () => {
        it(`Should return status 404`, () => {
          return request(app.getHttpServer())
            .get(`${formDefinitionPath}/${formDefinitionServiceName}`)
            .expect(404);
        });
      });
    });

    describe(`When PUT is made to the ${formDefinitionPath}/${formDefinitionServiceName}`, () => {
      it(`Should modify and return the updated Form Definition entry from the DB and status 200`, () => {
        return request(app.getHttpServer())
          .put(`${formDefinitionPath}/${formDefinitionServiceName}`)
          .send(formDefinitionUpdateData)
          .expect(formDefinitionUpdateData)
          .expect(200);
      });
      describe(`If the entry is not found`, () => {
        it(`Should return status 404`, () => {
          return request(app.getHttpServer())
            .put(`${formDefinitionPath}/${formDefinitionServiceName}`)
            .send(formDefinitionUpdateData)
            .expect(404);
        });
      });
    });

    describe(`When DELETE is made to the ${formDefinitionPath}/${formDefinitionServiceName}`, () => {
      it(`Should delete the Form Definition entry and return status 204`, () => {
        return request(app.getHttpServer())
          .delete(`${formDefinitionPath}/${formDefinitionServiceName}`)
          .expect(201);
      });
      describe(`If the entry is not found`, () => {
        it(`Should return status 404`, () => {
          return request(app.getHttpServer())
            .delete(`${formDefinitionPath}/${formDefinitionServiceName}`)
            .expect(201);
        });
      });
    });
  });
});
