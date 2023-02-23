
export default function QuestionContainer({
  children,
  questionName,
  questionText,
}: {
  children: React.ReactNode;
  questionName: string;
  questionText: string;
}) {

  return (
    <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">{questionName}</h3>
          <p className="mt-1 text-sm text-gray-500">
            {questionText}
          </p>
        </div>
        <div className="mt-5 space-y-6 md:col-span-2 md:mt-0">
          <div className="grid grid-cols-3 gap-6">
            {
              // questionData.fields.map((fieldData) => {
              //   const fieldError = errors[fieldData.fieldId] ?? undefined;
              //   const defaultValue = responseValues[fieldData.fieldId] ?? "";
              //   console.log(fieldData.fieldId)
              //   console.log(defaultValue)
              //   return (
              //     <div key={fieldData.fieldId} className="col-span-3 sm:col-span-2">
              //       <QuestionField data={fieldData} error={fieldError} defaultValue={defaultValue} />
              //     </div>
              //   )
              // })
              children
            }
          </div>
        </div>
      </div>
    </div>
  );
}