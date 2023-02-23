export interface ICurrencyField {
  data: {
    label: string,
    fieldId: string,
  },
  defaultValue: string,
  error: string | undefined,

}

export default function CurrencyField(props: ICurrencyField) {
  const { label, fieldId, } = props.data;
  const { error, defaultValue } = props;
  return (
    <div className="max-w-lg">
      <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
        {label}
      </label>
      <div className="relative mt-1 max-w-sm rounded-md shadow-sm col-span-3 sm:col-span-2 sm:mt-0">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">$</span>
        </div>
        <input
          type="number"
          name={fieldId}
          id={fieldId}
          className="block w-full  rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="0.00"
          defaultValue={defaultValue}
          aria-describedby="price-currency"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-gray-500 sm:text-sm" id="price-currency">
            USD
          </span>
        </div>
      </div>
    </div>
  )
}

