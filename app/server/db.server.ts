import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { getFirestore } from "firebase-admin/firestore";
import { FormInstanceDoc  } from "./routes-logic/requests/types";
import { FieldDoc, FormDoc, FormQuestion } from "./routes-logic/test-requests/types";

// helper function to convert firestore data to typescript
const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
});

// helper to apply converter to multiple collections
const dataPoint = <T extends FirebaseFirestore.DocumentData>(
  collectionPath: string
) => getFirestore().collection(collectionPath).withConverter(converter<T>());


export type Note = {
  title: string;
  body: string;
}

const version4Url = "testCollection/version4"


export const db = {
  userNotes: (uid: string) => dataPoint<Note>(`users/${uid}/notes`),
  requests: () => dataPoint<FormInstanceDoc>(`${version4Url}/requests`),
  testFormQuestions: (formId: string) => dataPoint<FormQuestion>(
    `${version4Url}/testForms/${formId}/testFormQuestions/`),
  testForms: () => dataPoint<FormDoc>(`${version4Url}/testForms`),
  questionFields : (formId:string, questionId:string)=> dataPoint<FieldDoc>(
    `${version4Url}/testForms/${formId}/testFormQuestions/${questionId}/fields`)
};
