import { ProfileContent } from "~/components/ProfileContent"
import TopNav from "~/components/TopNav";

export default function ProfilePage({ params }: { params: { name: string } }) {
  const name = params.name;
  return <div>
    <TopNav  text={"Profile"}/>
    <ProfileContent name={params.name} />
    </div>
}

