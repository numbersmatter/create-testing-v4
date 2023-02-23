
import type { ActionArgs, LoaderArgs} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { writeRequestDoc } from "~/server/route-logic/requests";
import type { Field } from "~/server/route-logic/requests/types";
import QuestionPanel from "~/server/route-logic/requests/ui/forms/QuestionPanel";
import { getTestFormById, getTestForms } from "~/server/route-logic/test-requests";
// import { writeRequestDoc } from "~/server/route-logic/requests";
// import { Field, RequestDoc } from "~/server/route-logic/requests/types";
// import QuestionPanel from "~/server/route-logic/requests/ui/forms/QuestionPanel";
// import { getTestFormById, getTestFormByParams, getTestFormQuestionDoc, getTestFormQuestions, getTestForms, hydrateQuestion } from "~/server/route-logic/test-requests";



export async function action({ params, request }: ActionArgs) {
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData);

  const formId = formValues.formId as string;

  // const formQuestions = await getTestFormQuestions(params)

  const testForm = await getTestFormById(formId);
  if (!testForm) {
    throw new Response("how did that happen", { status: 401 })
  }

  const profileHeaderData = {
    avatar: "https://firebasestorage.googleapis.com/v0/b/component-sites.appspot.com/o/user%2Fpq1caOfoOYMMljX8AXEmPQZEDij2%2FpublicImages%2F873759E5-B8C9-448C-9F4D-E98AC7F45366.png?alt=media&token=7b6a6b35-3dd4-49c4-9195-ea0aeda5183d",
    bannerImage: "https://firebasestorage.googleapis.com/v0/b/component-sites.appspot.com/o/user%2Fpq1caOfoOYMMljX8AXEmPQZEDij2%2FpublicImages%2FBanner%2012-11-2021.png?alt=media&token=835043c2-00d8-4f71-b8e0-b330c3ae44b6",
    displayName: "milachu92",
    profileHeadline: " Just a headline"
  };

  const questionStatus = testForm.questionOrder.reduce((acc, questionId) => ({ ...acc, [questionId]: false }), {})

  const questionResponses = testForm.questionOrder.reduce((acc, questionId)=>({...acc, [questionId]:{}}), {})

  const newQuestionsArray = testForm.questionOrder.map((questionId)=>{
    const formQuestion = testForm.formQuestionObj[questionId];
    const formIntFields = formQuestion.questionFieldsOrder.map((fieldId)=>({
      ...formQuestion.questionFieldsObj[fieldId], fieldId
    }))
    const formIntQuestion= {
      questionId,
      questionName: formQuestion.questionName,
      questionText: formQuestion.questionText,
      fields: formIntFields
    };
    return formIntQuestion
  })

  const newQuestionObj = newQuestionsArray.reduce((acc, formIntQuest)=>({... acc, [formIntQuest.questionId]: { questionName: formIntQuest.questionName, questionText: formIntQuest.questionText, fields: formIntQuest.fields}}), {})



  const newRequestDoc = {
    profileHeaderData,
    questionOrder: testForm.questionOrder,
    questionResponses,
    questionStatus,
    questionsObj: newQuestionObj,
    status: "in-progress"
  } 

  const requestId = await writeRequestDoc({...newRequestDoc, status:"in-progress"});



  // return json({newRequestDoc})

  return redirect(`/requests/${requestId.requestId}`);
}



export async function loader({ params }: LoaderArgs) {
  const testForms = await getTestForms(params);
  const testFormsOptions = testForms.map((formDoc) => ({ label: formDoc.formName, value: formDoc.formId }))

  const chooseForm: Field = {
    type: "select",
    label: "Choose Form",
    fieldId: "formId",
    options: testFormsOptions,
  }

  const questionDisplayData = {
    questionName: "Select Form to make a request",
    questionText: "text not really needed",
    fields: [chooseForm]
  }

  return { questionDisplayData, };
}




export default function MakeTestRequest() {
  const { questionDisplayData } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  

  return (
    <Form method="post">
      <QuestionPanel
        questionDisplayData={questionDisplayData}
        actionData={actionData}
      />

    </Form>
  );
}
