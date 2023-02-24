import type { ActionArgs, LoaderArgs} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { getQuestionDisplayData, processUserFormSubmission } from "~/server/route-logic/requests";
import QuestionPanel from "~/server/route-logic/requests/ui/forms/QuestionPanel";
// import { getQuestionDisplayData, processUserFormSubmission } from "~/server/route-logic/requests";
// import QuestionPanel from "~/server/route-logic/requests/ui/forms/QuestionPanel";


export async function action({params, request}:ActionArgs) {
   return await processUserFormSubmission(params, request)
  
}


export async function loader({params}:LoaderArgs) {
  const questionDisplayData= await getQuestionDisplayData(params);
  if(!questionDisplayData){
    throw new Response("No question display data given", {status:401})
  }

  return json({ questionDisplayData });
}


export default function QuestionDisplay() {
  const { questionDisplayData} = useLoaderData<typeof loader>();
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