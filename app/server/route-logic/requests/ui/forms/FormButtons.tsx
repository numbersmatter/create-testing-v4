import { Link } from "react-router-dom";



export default function FormButtons({ cancelUrl }:{ cancelUrl:string}) {

  return (
    <div className="py-3 flex justify-end">
      <Link
        to={cancelUrl}
        type="button"
        className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Cancel
      </Link>
      <button
        type="submit"
        className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Save
      </button>
    </div>

  );
}