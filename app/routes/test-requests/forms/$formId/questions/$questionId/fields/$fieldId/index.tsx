import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import TextField from "~/server/route-logic/requests/ui/forms/TextField";
import { deleteOptionByValue, getFieldDocById, writeOptionToField } from "~/server/route-logic/test-requests";
// import TextField from "~/server/route-logic/requests/ui/forms/TextField";
// import { deleteOptionByValue, getFieldDocById, writeOptionToField } from "~/server/route-logic/test-requests";



export async function action({ params, request }: ActionArgs) {

  const formId = params.formId ?? "no-formId";
  const questionId = params.questionId ?? "no-questionId";
  const fieldId = params.fieldId ?? "no-fieldId";

  const formData = await request.formData();
  const { _action, newOptionLabel, optionValue } = Object.fromEntries(formData);


  const FieldString = z.string().min(1);


  if (_action === "create") {
    const checkString = FieldString.safeParse(newOptionLabel)
    if (!checkString.success) {
      return checkString.error;
    } else {
      const writeResult = await writeOptionToField(formId,questionId, fieldId, checkString.data);
      return json({writeResult})
    }
  }

  if( _action=== "delete"){
    const checkString = FieldString.safeParse(optionValue)
    if(!checkString.success){
      return checkString.error;
    }else{
      return await deleteOptionByValue( formId, questionId,fieldId, checkString.data)
    }

  }


}

export async function loader({ params }: LoaderArgs) {
  const formId = params.formId ?? "no-formId";
  const questionId = params.questionId ?? "no-questionId";
  const fieldId = params.fieldId ?? "no-fieldId";

  const fieldDoc = await getFieldDocById(formId, questionId, fieldId)

  if (!fieldDoc) {
    throw new Response("no field by that id", { status: 404 })
  }

  return json({ fieldDoc })
}

export default function FieldID() {
  const { fieldDoc } = useLoaderData<typeof loader>();

  const options = fieldDoc.options ?? [];


  return (
    <article className="prose">
      <h4>Field Label: {fieldDoc.label} </h4>
      <p>{fieldDoc.type} </p>
      {
        fieldDoc.type === 'select'
          ? <ul>
            {
              options.map((option) =>
                <li key={option.value}>
                  {option.label}
                  <Form reloadDocument method="post" className="inline px-2" >
                    <input hidden name="optionValue" value={option.value} />
                    <button
                      type="submit"
                      aria-label="delete"
                      name="_action"
                      value="delete"
                    >
                      X
                    </button>
                  </Form>
                </li>
              )
            }
            <li >
              <Form className="flex space-x-2" method="post">
                <TextField data={{ label: "New Option", fieldId: "newOptionLabel" }} defaultValue="" />
                <button
                  className="rounded-md border border-gray-300 bg-orange-200 px-1"
                  type="submit"
                  name="_action"
                  value="create"
                >
                  Add
                </button>
              </Form>
            </li>
          </ul>
          : <p></p>
      }

      <ul>
        <li>
          <Link to='..'>Cancel</Link>
        </li>
        <li>
          <Link to='edit'>Edit</Link>
        </li>
        {
          fieldDoc.type === 'select'
            ? <li>
              <Link to='add-option'>Add Option</Link>
            </li>
            : null
        }

      </ul>
    </article>
  )
}