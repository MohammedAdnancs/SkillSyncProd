import { getCurrent } from "@/features/auth/queries";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspaces-form";
import { redirect } from "next/navigation";

const workspaceCreatePage =  async () => {

    const user = await getCurrent();
    if (!user) redirect(`${process.env.NEXT_PUBLIC_APP_URL}/landingpage`)
        
    return (
        <div className="w-full lg:max-w-xl">
            <CreateWorkspaceForm /> 
        </div>
    )
};

export default workspaceCreatePage;