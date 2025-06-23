import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { ProjectIdSettingsClient } from "./client";

const ProjectIdSettingsPage = async () => {
  const user = await getCurrent();
  if (!user) redirect(`${process.env.NEXT_PUBLIC_APP_URL}/landingpage`)
  return(
    <ProjectIdSettingsClient />
  );
}

export default ProjectIdSettingsPage;