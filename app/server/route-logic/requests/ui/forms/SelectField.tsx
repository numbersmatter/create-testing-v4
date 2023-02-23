import { Field } from "~/server/request-site.server";

export interface SelectFieldProps {
  data: Field,
  error?: string,
  defaultValue: string,
}


export default function SelectField(props: SelectFieldProps) {
  const { options, label, fieldId } = props.data;
  const error = props.error;
  const selectBorder = error ? " border-red-500" : " border-gray-300"
  const labelColor = error ? "text-red-500" : "text-gray-700"
  const defaultValue = props.defaultValue;
  const selectOptions = options ?? [];

  return (
    <>
      <label htmlFor={fieldId} className={`block text-sm font-medium ${labelColor} sm:mt-px sm:pt-2`}>
        {label}
      </label>
      <div className="mt-1 sm:col-span-2 sm:mt-0">
        <select
          id={fieldId}
          name={fieldId}
          defaultValue={defaultValue}
          className={`block w-full max-w-lg rounded-md ${selectBorder} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm`}
        >
          {
            selectOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)
          }
        </select>
        {
          error ?
            <p className="mt-2 text-sm text-red-600" id="email-error">
              {error}
            </p>
            : null
        }

      </div>
    </>
  )
}