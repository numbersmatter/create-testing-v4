import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getTestFormQuestions, getTestForms } from "~/server/route-logic/test-requests/test-requests.server";


export async function loader({params}:LoaderArgs) {
  
  const forms = await getTestForms(params)

  return json({forms});  
}


export default function FormListPage() {
  const { forms} = useLoaderData<typeof loader>();
  return (
    <article className="prose prose-xl">
      <h3>Welcome to FormListPage</h3>
      <p>This is the  FormListPage</p>
      <ul>
        {
          forms.map((form)=>
          <li key={form.formId}>
            <Link to={form.formId}>
              {form.formName}
            </Link>
          </li>)
        }
        <li>
          <Link to="create-form">
            Create New Form
          </Link>
        </li>
      </ul>
    </article>
  );
}