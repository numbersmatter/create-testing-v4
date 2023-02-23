
export interface IDisplayTextField {
  data: {
    label: string,
    id: string,
    defaultValue: string,
  } 
}

export default function DisplayText(props: IDisplayTextField) {
  const { label, id, defaultValue, } = props.data;
  const inputCss = "block border-2 w-full max-w-lg rounded-md border-gray-300 shadow-sm sm:max-w-xs sm:text-sm";
  const labelCss = "block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2";
  return (
    <>
      <label htmlFor="last-name" className={labelCss}>
        {label}
      </label>
      <div className="mt-1 sm:col-span-2 sm:mt-0">
      <input
          type= "text"
          name={id}
          id={id}
          defaultValue={defaultValue}
          disabled
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm"
        />
      </div>
    </>
  )
}