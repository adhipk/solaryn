import { ProfileContent } from "~/components/ProfileContent"
import TopNav from "~/components/TopNav";

export default async function ProfilePage({ params }: { params: { name: string } }) {
  const p = await params;
  return <div>
    <TopNav  text={"Profile"}/>
    <ProfileContent name={p.name} />
    </div>
}

