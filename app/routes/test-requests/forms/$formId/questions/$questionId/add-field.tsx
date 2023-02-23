import { useActionData, useLoaderData,  Form } from "@remix-run/react";
import type { ActionArgs, LoaderArgs} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { Field } from "~/server/route-logic/requests/types";
import { checkFieldAddFormSchema, writeFieldtoDb } from "~/server/route-logic/test-requests";
import { db } from "~/server/db.server";
import QuestionPanel from "~/server/route-logic/requests/ui/forms/QuestionPanel";
// import QuestionPanel from "~/server/route-logic/requests/ui/forms/QuestionPanel";
// import { Field } from "~/server/route-logic/requests/types";
// import { checkFieldAddFormSchema, writeFieldtoDb } from "~/server/route-logic/test-requests";

export async function loader({ params }: LoaderArgs) {
  const questionName = "Add Input Field";
  const questionText = "Enter data for input field";

  const fields: Field[] = [
    {
      type: "shortText",
      label: "Label",
      fieldId: "label",
    },
    {
      type: "select",
      label: "Select Field Type",
      fieldId: "type",
      options: [
        {value: "shortText", label:"Text Field"},
        {value: "longText", label:"Text Area"},
        {value: "select", label:"Select"},
        {value: "email", label:"Email"},
      ]
    },
  ];


  const questionDisplayData = {
    questionName,
    questionText,
    fields,
  }

  return json({ questionDisplayData});
}

export async function action({ params, request }: ActionArgs) {
  const formId = params.formId ?? "no-formId";
  const questionId = params.questionId ?? "no-questionId";
  const formref =  db.testForms().doc(formId);
  const formSnap = await formref.get();
  const formDoc = formSnap.data();

  if(!formDoc){
    throw new Response("no form doc", {status: 401})
  }

  const validCheck = await checkFieldAddFormSchema(params, request);

  if (!validCheck.success) {
    return validCheck.error
  } else {
    const values = { ...validCheck.data }
    const writeField = await writeFieldtoDb(formId, questionId, values);

    if(!writeField){
      throw new Response("error on write", {status:406})
    }

    
    return redirect(`/test-requests/forms/${formId}/questions/${questionId}/fields/${writeField.fieldId}`)
  }
}



export default function AddField() {
  const { questionDisplayData} = useLoaderData<typeof loader>();
  const actionData = useActionData();
  return (
      <Form method="post" >
        <QuestionPanel
          questionDisplayData={questionDisplayData} 
          actionData={actionData}
        />
      </Form>
    );
}