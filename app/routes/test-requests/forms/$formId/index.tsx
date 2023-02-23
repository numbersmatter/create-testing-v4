import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getTestFormByParams } from "~/server/route-logic/test-requests";


export async function loader({ params }: LoaderArgs) {
  const formDoc = await getTestFormByParams(params);
  if (!formDoc) {
    throw new Response("No form by that Id found", { status: 404 })
  }

  return json({ formDoc });
}


export default function FormPage() {
  const { formDoc } = useLoaderData<typeof loader>();
  return (
    <article className="prose prose-xl">
      <h3>Welcome to FormPage</h3>
      <p>This is the  FormPage</p>
      <ul>
        {
          formDoc.questionOrder.map((questionId) => {
            // const questionDoc = formDoc.questionsObj[questionId]
            return (
              <li key={questionId}>
                <Link to={`questions/${questionId}`}>
                  {questionId}
                </Link>
              </li>
            )
          }
          )
        }
        <li>
          <Link to="add-question">
            Add Question
          </Link>
        </li>

      </ul>

    </article>
  );
}