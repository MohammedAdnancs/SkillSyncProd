import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { RepositoryViewerWrapper } from "@/components/github/repository-viewer-wrapper";

const RepositoryPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return (
    <div className="h-full w-full">
      <RepositoryViewerWrapper />
    </div>
  );
};

export default RepositoryPage;