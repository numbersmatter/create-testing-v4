import { redirect } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import { db } from "~/server/db.server";
import type { Field, QuestionResponses, FormInstanceDoc, StringIndexObj } from "./types";


// Level 3 
export const getRequestDocById = async (requestId: string) => {
  const requestDocRef = db.requests().doc(requestId);
  const requestDocSnap = await requestDocRef.get();
  const requestDocData = requestDocSnap.data();
  if (!requestDocData) {
    return undefined;
  }

  return { ...requestDocData, requestId };
};

export const setUserResponseToQuestion = async(
  requestId:string, 
  questionId: string, 
  userResponse: StringIndexObj 
)=>{
  const requestDocRef = db.requests().doc(requestId);
  const requestDoc = await getRequestDocById(requestId);
  if(!requestDoc){
    throw new Response("request not authorized", {status:401})
  };
  
  // prepare updated questionStatus
  const newQuestionStatus = {...requestDoc.questionStatus, [questionId]: true}
  
  // prepare updated questionResponse object to save
  const newQuestionResponses = { ...requestDoc.questionResponses, [questionId]:userResponse } as QuestionResponses;


  //  had to use a "set" because update does not 
  // see questionResponses as the same type as newQuestionResponses
  return await requestDocRef.set(
    { 
      questionStatus: newQuestionStatus, 
      questionResponses: newQuestionResponses,
    }, 
    {merge:true}
  )
};

const getProfileHeader = (artistId: string)=>{
  const avatar = "https://firebasestorage.googleapis.com/v0/b/component-sites.appspot.com/o/user%2Fpq1caOfoOYMMljX8AXEmPQZEDij2%2FpublicImages%2F873759E5-B8C9-448C-9F4D-E98AC7F45366.png?alt=media&token=7b6a6b35-3dd4-49c4-9195-ea0aeda5183d"

  const bannerImage ="https://firebasestorage.googleapis.com/v0/b/component-sites.appspot.com/o/user%2Fpq1caOfoOYMMljX8AXEmPQZEDij2%2FpublicImages%2FBanner%2012-11-2021.png?alt=media&token=835043c2-00d8-4f71-b8e0-b330c3ae44b6";

  const profileHeadline = "Doing my thing"

  return {
    avatar,
    bannerImage,
    displayName: "Milachu92",
    profileHeadline,
  }
}



// schema area

const createTextSchema = (field: Field)=>{
  const schema = field.schema;
  return z.string().max(100, "This field can be no more then 100 characters");
};

const createTextAreaSchema = (field: Field)=>{
  const schema = field.schema;
  return z.string().max(10000, "This field can be no more then 10000 characters");
};

const createEmailSchema = (field: Field)=>{
  const schema = field.schema;
  return z.string().email();
};
  

const createSelectSchema = (field:Field) => {
  const  schema = field.schema;
  return z.string().min(3);
};



const getFieldSchema = (field:Field)=> {
  if(field.type ==="email"){
    return createEmailSchema(field)
  };
  if(field.type ==="shortText"){
    return createTextSchema(field)
  };
  if(field.type ==="longText"){
    return createTextAreaSchema(field)
  };
  if(field.type ==="select"){
    return createSelectSchema(field)
  };


  return z.string();
}


export const getQuestionDisplayData = async (params:Params<string>) => {
  const requestId = params.requestId ?? "no-requestId";
  const questionId = params.questionId ?? "no-questionId";
  const requestDoc = await getRequestDocById(requestId);

  if(!requestDoc){
    return undefined;
  };

  if(requestDoc.status === "submitted"){
    return undefined;
  };

  const questionDisplayData = requestDoc.questionsObj[questionId];

  return questionDisplayData;
};


export const getQuestionSchemaObject = (fields: Field[])=>{
 const questionSchema = fields.reduce((acc, field)=>({...acc, [field.fieldId]:getFieldSchema(field)}), {})

 return questionSchema;
}





// Level 4
// Gut  feeling is only level four should export

export const getFormProfile = async (params: Params<string>) => {
  const requestId = params.requestId ?? "no-requestId";
  const requestDoc = await getRequestDocById(requestId);

  if (!requestDoc) {
    return undefined;
  }

  return requestDoc.profileHeaderData;
};

export const processUserFormSubmission = async (params: Params<string>, request: Request) => {
  const requestId = params.requestId ?? "no requestId";
  const questionId = params.questionId ?? "no questionId";
  const formValues = Object.fromEntries(await request.formData());

  // create validation scheme
  const questionDisplayData = await getQuestionDisplayData(params);

  if (!questionDisplayData) {
    throw new Response("No question data", { status: 401 });
  }

  //  get  z schema
  const QuestionSchemaObject = getQuestionSchemaObject(
    questionDisplayData.fields
  );

  const QuestionSchema = z.object(QuestionSchemaObject);


  // check form submission validator
  const validCheck = QuestionSchema.safeParse(formValues);

  // verify form matches schema
  // if does not match return zod errors
  if (!validCheck.success) {
    return validCheck.error;
  }

  // if match write data to the response collection for questions
  const writeToRequestDoc = setUserResponseToQuestion(
    requestId,
    questionId,
    validCheck.data
  );

  // redirect back to the index page for cycle

  const redirectUrl = `/requests/${requestId}`;

  return redirect(redirectUrl);
};


export const makeRequestDoc = async (
  artistId : string, 
  questionStatus:{[questionId: string]:boolean}, 
  questionOrder: string[],

)=>{

  const newRequestRef = db.requests().doc();

  const profileHeaderData = getProfileHeader(artistId);
  const questionsObj = {};
  const status = "in-progress";
  const questionResponses = {};



  const requestDocData: FormInstanceDoc = {
    profileHeaderData,
    questionStatus,
    questionOrder,
    status,
    questionResponses,
    questionsObj,
  }

  const writeResult = await newRequestRef.create(requestDocData);


  return { writeResult, requestId: newRequestRef.id}
}


export const getRequestIdRedirectUrl =async (params:Params<string>) => {
  const requestId = params.requestId ?? "no-requestId";
  const requestDoc = await getRequestDocById(requestId);

  if(!requestDoc){
    return undefined;
  };

  if(requestDoc.status === "submitted"){
    const submittedUrl = `/requests/${requestId}/submitted`;
    return submittedUrl;
  };

  const nextNonCompletedQuestion = requestDoc.questionOrder.find(
    (questionId)=> requestDoc.questionStatus[questionId] === false
  );

  if(!nextNonCompletedQuestion){
    const reviewBeforeSubmitUrl = `/requests/${requestId}/review`;
    return reviewBeforeSubmitUrl;
  };
  
  const nextQuestionUrl = `/requests/${requestId}/questions/${nextNonCompletedQuestion}`;

  return nextQuestionUrl;
};


export const writeRequestDoc =async (requestDoc: FormInstanceDoc) => {
  const requestDocRef = db.requests().doc();

  const writeToDB = requestDocRef.create(requestDoc);

  return { requestId: requestDocRef.id}
  
}