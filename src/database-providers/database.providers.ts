import * as firebaseAdmin from 'firebase-admin';

export const databaseProviders = [
  {
    provide: 'FIREBASE_CONNECTION',
    useFactory: async () => {
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.applicationDefault(),
        databaseURL: 'https://nestjs-serverless-api.firebaseio.com'
      });
      return firebaseAdmin.firestore();
    }
  },
  {
    provide: 'FIREBASE_MOCK',
    useFactory: () => ({
      document: () => ({})
    })
  }
];
