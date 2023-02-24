import { json, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getRequestDocById } from "~/server/route-logic/requests";

export async function loader({ params }: LoaderArgs) {
  const requestId = params.requestId ?? "no-requestId"

  const requestDoc = await getRequestDocById(requestId);

  if (!requestDoc) {
    throw new Response("no document found", { status: 404 })
  }

  return json({ requestDoc })
}


export default function ReviewAnswers() {
  const { requestDoc } = useLoaderData<typeof loader>();

  return (
    <div>
      <h3>Review your answers</h3>
      {
        requestDoc.questionOrder.map((questionId) => {
          const reqQuestion = requestDoc.questionsObj[questionId];
          const responses = requestDoc.questionResponses[questionId]

          return (

            <div key={questionId}>
              <p>
                {requestDoc.questionsObj[questionId].questionName}
              </p>
              <ul>
                {
                  reqQuestion.fields.map((field)=>
                  <p key={field.fieldId}> {responses[field.fieldId]} </p>
                  )  
                }
              </ul>

            </div>
          )
        }
        )
      }

    </div>
  )
}