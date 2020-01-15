import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import * as FirebaseAdmin from "firebase-admin";

import * as serviceAccount from "../nestjs-serverless-api-firebase-adminsdk-456lv-7ca96e7f20";

FirebaseAdmin.initializeApp({
  credential: FirebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://nestjs-serverless-api.firebaseio.com"
});

@Module({
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
