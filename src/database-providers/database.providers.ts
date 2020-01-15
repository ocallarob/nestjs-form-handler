import * as serviceAccount from '../../nestjs-serverless-api-firebase-adminsdk-456lv-7ca96e7f20';
import * as firebaseAdmin from 'firebase-admin';

export const databaseProviders = [
  {
    provide: 'FIREBASE_CONNECTION',
    useFactory: () => {
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccount),
        databaseURL: 'https://nestjs-serverless-api.firebaseio.com'
      });
      return firebaseAdmin.firestore();
    }
  }
];
