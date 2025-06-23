import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { ProjectIdStoriesClient } from "./client";

const ProjectIdStoriesPage = async () => {
  const user = await getCurrent();
  if (!user) redirect(`${process.env.NEXT_PUBLIC_APP_URL}/landingpage`)
  return(
    <ProjectIdStoriesClient />
  );
}

export default ProjectIdStoriesPage;