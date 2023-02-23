import type { Field } from "../../types";
import FormButtons from "./FormButtons";
import QuestionContainer from "./QuestionContainer";
import QuestionFields from "./QuestionFields";




export default function QuestionPanel({ 
  questionDisplayData,
  actionData
}:{
  questionDisplayData: {
    questionName: string,
    questionText: string,
    fields: Field[],
  } ,
  actionData:any
}) {
  const { questionName, questionText, fields }= questionDisplayData;
  return (
    <>
        <div className="space-y-6 py-4 px-4 rounded-lg bg-slate-200">
          {
            actionData
              ? <p>{JSON.stringify(actionData)}</p>
              : <p> &nbsp; </p>
          }
  
          <QuestionContainer
            questionName={questionName}
            questionText={questionText}
          >
            <QuestionFields fields={fields} />
          </QuestionContainer>
        </div>
        <FormButtons cancelUrl="../"/>
    </>
  );
}