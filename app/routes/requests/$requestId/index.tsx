import type { LoaderArgs} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getRequestIdRedirectUrl } from "~/server/routes-logic/requests";

export async function loader({params}:LoaderArgs) {
  const redirectUrl= await getRequestIdRedirectUrl(params);

  if(!redirectUrl){
    throw new Response("No Redirect Url Given", {status:401})
  };

  return redirect(redirectUrl);
}
