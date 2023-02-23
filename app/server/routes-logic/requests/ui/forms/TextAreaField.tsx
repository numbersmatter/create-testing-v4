

export interface TextAreaProps {
  data: { 
    label: string,
    fieldId: string,
  },
  defaultValue: string,
  error?: string | undefined,
}

export default function TextAreaField(props: TextAreaProps) {
  const { label, fieldId, } = props.data;
  const { error, defaultValue } = props;
  const inputErrorCss = "block w-full rounded-md border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm";
  const inputCss = "block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm";
  const labelCss = "block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2";
  const labelErrorCss = "block text-sm font-medium text-red-500 sm:mt-px sm:pt-2"


  return (
    <>
      <label htmlFor="last-name" className={error ? labelErrorCss : labelCss}>
        {label}
      </label>
      <div className="mt-1 sm:col-span-2 sm:mt-0">
        <textarea
          id={fieldId}
          name={fieldId}
          rows={4}
          className={ error ? inputErrorCss : inputCss}
          defaultValue={defaultValue}
        />
        {
          error ?
            <p className="mt-2 text-sm text-red-600" id="text-area error">
              {error}
            </p>
          : null
        }
      </div>
    </>
  )
}