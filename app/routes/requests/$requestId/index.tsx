import { LoaderArgs, redirect } from "@remix-run/node";
import { getRequestIdRedirectUrl } from "~/server/route-logic/requests";

export async function loader({params}:LoaderArgs) {
  const redirectUrl= await getRequestIdRedirectUrl(params);

  if(!redirectUrl){
    throw new Response("No Redirect Url Given", {status:401})
  };

  return redirect(redirectUrl);
}
