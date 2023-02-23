import ProfileHeader from "./ProfileHeader";



export default function ArtistFormProfile({
  children,
  profileHeaderData,
}:{
  children: React.ReactNode,
  profileHeaderData: {
    bannerImage: string;
    avatar: string;
    displayName: string;
    profileHeadline: string;
}

}) {
  
  return (
    <div className="min-h-screen bg-[#2a9bb5] flex flex-col ">
      <ProfileHeader data={profileHeaderData} />
      <div className="max-w-7xl py-5 mb-2 sm:px-6 lg:px-8 grow ">
        {/* Content goes here */ children}
      </div>
    </div>
  )
}
