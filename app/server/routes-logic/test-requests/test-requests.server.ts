import type { Params } from "@remix-run/react";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import { db } from "~/server/db.server";
import type { FieldDoc, FormDoc, FormQuestion } from "./types";
import { FieldArrayTypes } from "./types";

// Level 3
// db operation helpers
const getTestFormQuestionDocs = async (formId: string) => {
  const testFormQuestionsSnap = await db.testFormQuestions(formId).get();
  const testFormQuestionsDocs = testFormQuestionsSnap.docs.map((doc) => ({
    ...doc.data(),
    formQuestionId: doc.id,
  }));

  return testFormQuestionsDocs;
};

export const getTestFormQuestionDoc = async (
  formId: string,
  formQuestionId: string
) => {
  const formQuestionRef = db.testFormQuestions(formId).doc(formQuestionId);
  const formQuestionSnap = await formQuestionRef.get();
  const formQuestionData = formQuestionSnap.data();

  if (!formQuestionData) {
    return undefined;
  }

  return { ...formQuestionData, formQuestionId };
};

export const writeNewQuestionToDb = async (
  formId: string,
  data: FormQuestion
) => {
  const newQuestionRef = db.testFormQuestions(formId).doc();

  const writeResult = await newQuestionRef.create(data);

  return { writeResult, questionId: newQuestionRef.id };
};
export const writeFormToDb = async (data: FormDoc) => {
  const newFormRef = db.testForms().doc();

  const writeResult = await newFormRef.create(data);

  return { writeResult, formId: newFormRef.id };
};

// Level 4
// route level actions

export const getTestFormQuestions = async (params: Params<string>) => {
  const formId = params.formId ?? "no-formId";
  return getTestFormQuestionDocs(formId);
};

export const getQuestionFields = async (params: Params<string>) => {
  const formId = params.formId ?? "no-formId";
  const questionId = params.questionId ?? "no-questionId";

  const fieldsSnap = await db.questionFields(formId, questionId).get();

  const fields = fieldsSnap.docs.map((fieldSnap) => ({
    ...fieldSnap.data(),
    fieldId: fieldSnap.id,
  }));

  return fields;
};

export const getTestFormQuestionById = async (params: Params<string>) => {
  const formQuestionId = params.formQuestionId ?? "no-formQuestionId";
  const formId = params.formId ?? "no-formId";
  const formQuestionDoc = await getTestFormQuestionDoc(formId, formQuestionId);

  if (!formQuestionDoc) {
    throw new Response("No question by that Id found", { status: 404 });
  }

  return formQuestionDoc;
};

export const getTestForms = async (params: Params<string>) => {
  const testFormsSnap = await db.testForms().get();
  const testForms = testFormsSnap.docs.map((doc) => ({
    ...doc.data(),
    formId: doc.id,
  }));

  return testForms;
};

//  REMEMBER THIS BROKE THE SYSTEM
export const getTestFormByParams = async (params: Params<string>) => {
  const formId = params.formId ?? "no-formId";
  const formSnap = await db.testForms().doc(formId).get();
  const formDoc = formSnap.data();

  if (!formDoc) {
    return undefined;
  }

  return { ...formDoc, formId: formSnap.id };
};
export const getTestFormById= async (formId: string) => {
  const formSnap = await db.testForms().doc(formId).get();
  const formDoc = formSnap.data();

  if (!formDoc) {
    return undefined;
  }

  return { ...formDoc, formId: formSnap.id };
};

export const safeParseAddFormQuestion = async (
  params: Params<string>,
  request: Request
) => {
  // const formId = params.formId ?? "no-formId";
  const formValues = Object.fromEntries(await request.formData());

  const QuestionSchema = z.object({
    questionName: z.string().min(2),
    questionText: z.string(),
  });

  return QuestionSchema.safeParse(formValues);
};

export const handleUserRequestToCreateForm = async (
  params: Params<string>,
  request: Request
) => {
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData);

  const FormSchema = z.object({
    formName: z.string().min(1),
    formText: z.string(),
  });

  const checkDataShape = FormSchema.safeParse(formValues);

  return checkDataShape;

  // if(!checkDataShape.success){
  //   return checkDataShape.error;
  // }else{
  //   const formDoc = { ...checkDataShape.data, questionOrder:[], questionsObj: {}}
  //   const formWrite = await writeFormToDb(formDoc);
  //   return redirect(`/forms/${formWrite.formId}`)
  // }
};

export const writeQuestionIdToForm = (formId: string, questionId: string) => {
  const formRef = db.testForms().doc(formId);

  const formUpdate = {
    questionOrder: FieldValue.arrayUnion(questionId),
  };

  return formRef.update(formUpdate);
};

export const checkFieldAddFormSchema = async (
  params: Params,
  request: Request
) => {
  // const questionId= params.questionId ?? "no questionId"
  const formValues = Object.fromEntries(await request.formData());

  const FieldSchema = z.object({
    type: z.enum(FieldArrayTypes),
    label: z.string().min(2),
  });

  const checkShape = FieldSchema.safeParse(formValues);

  return checkShape;
};

export const writeFieldtoDb = async (
  formId: string,
  questionId: string,
  fieldData: FieldDoc
) => {
  const fieldRef = db.questionFields(formId, questionId).doc();
  const questionRef = db.testFormQuestions(formId).doc(questionId);
  const writeFieldDoc = await fieldRef.create(fieldData);

  const questionUpdateData = {
    questionFieldsOrder: FieldValue.arrayUnion(fieldRef.id),
  };

  await questionRef.update(questionUpdateData);

  return { ...writeFieldDoc, fieldId: fieldRef.id };
};

export const getFieldDocById = async (
  formId: string,
  questionId: string,
  fieldId: string
) => {
  const fieldRef = db.questionFields(formId, questionId).doc(fieldId);
  const fieldSnap = await fieldRef.get();
  const fieldData = fieldSnap.data();

  if (!fieldData) {
    return undefined;
  }

  return { ...fieldData, fieldId };
};

export const writeOptionToField = async (
  formId: string,
  questionId: string,
  fieldId: string,
  label: string
) => {
  // const questionRef = db.testQuestions().doc(questionId);
  const fieldRef = db.questionFields(formId, questionId).doc(fieldId);
  // const questionSnap = await questionRef.get();

  const fieldDocSnap = await fieldRef.get();

  const fieldDoc = fieldDocSnap.data();
  if (!fieldDoc) {
    return undefined;
  }

  // create random unique id for option value
  const uniqueValue = db.testForms().doc().id;

  // update fields array in questionDoc
  const writeOption = await fieldRef.update({
    options: FieldValue.arrayUnion({ label: label, value: uniqueValue }),
  });

  return { writeOption };
};

export const deleteOptionByValue = async (
  formId: string,
  questionId: string,
  fieldId: string,
  optionValue: string
) => {
  // const questionRef = db.testQuestions().doc(questionId);
  const fieldRef = db.questionFields(formId, questionId).doc(fieldId);
  // const questionSnap = await questionRef.get();

  const fieldDocSnap = await fieldRef.get();

  const fieldDoc = fieldDocSnap.data();
  if (!fieldDoc) {
    return undefined;
  }

  const oldOptions = fieldDoc.options ?? [];

  // filter out options by not equal to value that was passed
  const newOptions = oldOptions.filter(
    (option) => option.value !== optionValue
  );

  // update fields array in questionDoc
  return await fieldRef.update({
    options: newOptions,
  });
};

export const hydrateQuestion = async (formId: string, questionId: string) => {
  const formQuestionRef = db.testFormQuestions(formId).doc(questionId);
  const formQuestionFieldsRef = db.questionFields(formId, questionId);

  const formQuestionSnap = await formQuestionRef.get();
  const formFieldsSnap = await formQuestionFieldsRef.get();
  const formQuestionDoc = formQuestionSnap.data();

  if (!formQuestionDoc) {
    return undefined;
  }

  const formFields = formFieldsSnap.docs.map((doc) => ({
    ...doc.data(),
    fieldId: doc.id,
  }));

  // const fieldObj = formFields.reduce((acc, fieldDoc)=> {
  //   const {fieldId, ...data} = fieldDoc
  //   return ({...acc, [fieldId]:fieldDoc })}, {}
  // )

  const questionFields = formQuestionDoc.questionFieldsOrder.map((fieldId) => {
    return formFields.find((fieldDoc) => fieldDoc.fieldId === fieldId);
  });


  //  need to turn this into
  //  request expectation of  a question

  const requestQuestion = {
    questionName: formQuestionDoc.questionName,
    questionText: formQuestionDoc.questionText,
    fields: questionFields,
  };

  return "test-string"
};


export const createRequestDoc=async (params:any) => {

  const formQuestions = await getTestFormQuestions(params);
  

  
  
}
