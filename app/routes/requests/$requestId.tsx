import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getFormProfile } from "~/server/route-logic/requests";
import ArtistFormProfile from "~/server/route-logic/requests/ui/ArtistFormProfile";
// import { getFormProfile } from "~/server/route-logic/requests";
// import ArtistFormProfile from "~/server/route-logic/requests/ui/ArtistFormProfile";


export async function loader({params}:LoaderArgs) {
  const formProfile = await getFormProfile(params);
  if(!formProfile){
    throw new Response("Header Data failed to load", {status:401})
  }

  return json({formProfile});
}



export default function FormProfile() {
  const { formProfile} = useLoaderData<typeof loader>();
  
  return (
    <ArtistFormProfile profileHeaderData={formProfile}>
      <Outlet/>
    </ArtistFormProfile>
    );
}