
export interface IDateField {
  data: {
    label: string,
    fieldId: string,
  },
  defaultValue: string,
  error: string | undefined

}


export default function DateField(props: IDateField) {
  const { label, fieldId } = props.data;
  const { error, defaultValue } = props;

  return (
    <>
      <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="date"
        name={fieldId}
        id={fieldId}
        defaultValue={defaultValue}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
    </>
  )
}
