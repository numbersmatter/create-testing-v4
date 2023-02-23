import type { LoaderArgs, ActionArgs} from "@remix-run/node";
import { redirect} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import type { Field } from "~/server/route-logic/requests/types";
import QuestionPanel from "~/server/route-logic/requests/ui/forms/QuestionPanel";
import { safeParseAddFormQuestion, writeNewQuestionToDb } from "~/server/route-logic/test-requests";
// import type { Field } from "~/server/route-logic/requests/types";
// import QuestionPanel from "~/server/route-logic/requests/ui/forms/QuestionPanel";
// import { safeParseAddFormQuestion,writeNewQuestionToDb, writeQuestionIdToForm } from "~/server/route-logic/test-requests/test-requests.server";


export async function action({params, request}:ActionArgs) {
  const formId = params.formId ?? "no-formId";
  
  const checkDataShape =await safeParseAddFormQuestion(params, request);

    if(!checkDataShape.success){
    return checkDataShape.error;
  }else{
    const formQuestion = {...checkDataShape.data, questionFieldsOrder: [], questionFieldsObj:{} }
    const writeQuestion = await writeNewQuestionToDb(formId, formQuestion);

    if(!writeQuestion){
      throw new Response("no question I match", {status:401})
    }
    // await writeQuestionIdToForm(formId, writeQuestion.questionId);
    
    return redirect(`/test-requests/forms/${formId}/questions/${writeQuestion.questionId}`)
  }

}



export async function loader({params}:LoaderArgs) {


  const questionName = "Add Question to Form";
  const questionText = "Name your question and give it a description"
  const formName: Field = {
    fieldId: "questionName",
    type: "shortText",
    label: "Question Name",
  };
  const formText: Field = {
    fieldId: "questionText",
    type: "longText",
    label: "Question Text",
  };
  const fields= [formName, formText];

  const questionDisplayData = { questionName, questionText, fields};

  return json({ questionDisplayData });  
}


export default function AddQuestion() {
  const { questionDisplayData} = useLoaderData<typeof loader>();
  return (
      <Form method="post" >
        <QuestionPanel
          questionDisplayData={questionDisplayData} 
          actionData={{}}
        />
      </Form>
    );
}