import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { TeamsClient } from "./client";



const TeamsPage = async () => {
  const user = await getCurrent();
  if (!user) redirect(`${process.env.NEXT_PUBLIC_APP_URL}/landingpage`)

  return <TeamsClient />;
};

export default TeamsPage;