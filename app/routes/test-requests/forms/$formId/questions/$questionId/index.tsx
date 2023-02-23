
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import {  getQuestionFields, getTestFormQuestionById, getTestFormQuestionDoc } from "~/server/route-logic/test-requests";


export async function loader({ params }: LoaderArgs) {
  const formId = params.formId ?? "formId"
  const questionId = params.questionId ?? "formId"
  const questionDoc = await getTestFormQuestionDoc(formId, questionId);
  if (!questionDoc) {
    throw new Response("No question by that Id found", { status: 404 })
  }

  const questionFields = await getQuestionFields(params)

  return json({ questionDoc, questionFields });
}


export default function QuestionPage() {
  const { questionDoc, questionFields } = useLoaderData<typeof loader>();
  return (
    <article className="prose prose-xl">
      <h3> {questionDoc.questionName}</h3>
      <p>{ questionDoc.questionText }</p>
      <ul>
        {
          questionDoc.questionFieldsOrder.map((fieldId) => {
            const doc = questionFields.find(fieldDoc => fieldDoc.fieldId === fieldId);
            const fieldDoc = doc ?? {label:"Not Found", fieldId:"no-fieldId"}
            return (
              <li key={fieldId}>
                <div>
                 {fieldDoc.label} 
                 <Link to={`fields/${fieldId}`}> Edit </Link>

                </div>
              </li>
            )
          }
          )
        }
        <li>
          <Link to="add-field">
            Add Field
          </Link>
        </li>

      </ul>

    </article>
  );
}