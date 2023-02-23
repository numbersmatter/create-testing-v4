import { Field } from "~/server/request-site.server";
import CurrencyField from "./CurrencyField";
import DateField from "./DateField";
import SelectField from "./SelectField";
import TextAreaField from "./TextAreaField";
import TextField from "./TextField";


export type QuestionTypes = "select" | "date" | "currency" | "longText" | "shortText"
export interface QuestionFieldProps {
  data: Field,
  error: string | undefined,
  defaultValue: string,
}

export default function QuestionField(props: QuestionFieldProps) {
  const questionData = props.data
  const questionError = props.error;
  const defaultValue = props.defaultValue;

  switch (questionData.type) {
    case "shortText":
      return <TextField data={questionData} error={questionError} defaultValue={defaultValue}/>;
    case "longText":
      return <TextAreaField data={questionData} error={questionError} defaultValue={defaultValue}/>;

    case "currency" :
      return <CurrencyField error={questionError} data={questionData} defaultValue={defaultValue}/>;
    case "date" :
      return <DateField error={questionError} data={questionData} defaultValue={defaultValue}/>;
    case "select":
      const options = questionData.options ?? []
      const selData = { ...questionData, options: options }
      return <SelectField  data = {selData}  error={questionError} defaultValue={defaultValue}/>
    default:
      return <div><p>Something went wrong</p></div>
  }

}
