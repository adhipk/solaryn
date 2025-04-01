"use client"
import { useParams } from "next/navigation";
import { ProfileContent } from "~/components/ProfileContent"
import TopNav from "~/components/TopNav";

export default function ProfilePage() {
  const params = useParams<{name: string}>();
  return <div>
    <TopNav  text={"Profile"}/>
    <ProfileContent name={params.name} />
    </div>
}

