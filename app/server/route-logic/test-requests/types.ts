
export type FieldDoc = {
  label: string;
  type: FieldTypes;
  options?: {label:string , value: string}[];
};

export type FieldTypes =
  | "select"
  | "date"
  | "currency"
  | "longText"
  | "shortText"
  | "imageUpload";
export const FieldArrayTypes =
  ["select",
   "date",
   "currency",
   "longText",
   "shortText",
   "imageUpload"] as const;

  export interface FormQuestion {
    questionFieldsOrder: string[];
    questionFieldsObj: {[id:string]: FieldDoc}  ;
    questionName: string;
    questionText: string;
  }

  export interface FormDoc {
    formName: string;
    formText: string;
    questionOrder: string[];
    formQuestionObj: { [id:string] : FormQuestion}
  
  }
  
